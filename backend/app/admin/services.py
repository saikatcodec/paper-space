from playwright.async_api import async_playwright
from parsel import Selector
import random

from app.admin.schemas import Publications, ProfileCreate
from .utils import parse_date


class Services:

    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None

    async def initialize(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True, args=["--disable-blink-features=AutomationControlled"]
        )
        context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
        )
        self.page = await context.new_page()

    async def list_down_all_publication(self, url: str | None = None):
        await self.initialize()
        if not url:
            url = "https://www.researchgate.net/profile/Md-Alam-Hossain"

        research_list = []

        try:
            await self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await self.page.wait_for_timeout(random.randint(2000, 5000))  # Random delay

            content = await self.page.content()
            selector = Selector(text=content)
            pub_card = selector.css(
                ".nova-legacy-c-card__body.nova-legacy-c-card__body--spacing-none"
            )
            publications = pub_card.css(".nova-legacy-o-stack__item")
            for pub in publications:
                tls = pub.css(
                    ".nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare::text"
                ).get()
                link = pub.css(
                    ".nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare::attr(href)"
                ).get()
                types = pub.css(
                    ".nova-legacy-v-publication-item__meta-left *::text"
                ).getall()

                pub_date = pub.css(
                    ".nova-legacy-e-list__item.nova-legacy-v-publication-item__meta-data-item span::text"
                ).get()

                research_list.append(
                    Publications(
                        title=tls,
                        link=link,
                        types=types,
                        pub_date=parse_date(pub_date),
                        pub_date_str=pub_date,
                    )
                )

        except Exception as e:
            print(f"Error: {e}")
            research_list = []
        finally:
            await self.close()

        return research_list

    async def close(self):
        await self.browser.close()
        await self.playwright.stop()

    async def get_profile(self, url: str | None = None):
        await self.initialize()

        if not url:
            url = "https://www.researchgate.net/profile/Md-Alam-Hossain"

        try:
            await self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await self.page.wait_for_timeout(random.randint(2000, 5000))  # Random delay

            content = await self.page.content()
            selector = Selector(text=content)

            # Get profile picture and name using profile selector
            profile = selector.css(
                ".nova-legacy-o-pack.nova-legacy-o-pack--gutter-m.nova-legacy-o-pack--width-auto.nova-legacy-o-pack--vertical-align-middle.vcard"
            )
            profile_pic = profile.css("img.nova-legacy-e-avatar__img::attr(src)").get()
            name = profile.css(".nova-legacy-l-flex__item::text").get()

            # Get total publications, reads and total citations
            info = selector.css(
                ".nova-legacy-o-grid.nova-legacy-o-grid--gutter-m.nova-legacy-o-grid--order-normal.nova-legacy-o-grid--horizontal-align-left.nova-legacy-o-grid--vertical-align-top"
            )
            total_pub = info.css(
                'div[data-testid="publicProfileStatsPublications"]::text'
            ).get()
            reads = info.css('div[data-testid="publicProfileStatsReads"]::text').get()
            total_cit = info.css(
                'div[data-testid="publicProfileStatsCitations"]::text'
            ).get()

            # Find skills
            about = selector.css('div[data-testid="publicProfileAboutSection"]')
            skills = about.css(".nova-legacy-l-flex__item a::text").getall()

            # Institution and position
            ins_section = selector.css(
                ".nova-legacy-v-entity-item.nova-legacy-v-entity-item--size-m.gtm-institution-item"
            )
            ins_name = ins_section.css(
                "a.nova-legacy-e-link.nova-legacy-e-link--color-inherit.nova-legacy-e-link--theme-bare::text"
            ).get()
            ins_dept = ins_section.css(
                ".nova-legacy-e-list__item.nova-legacy-v-entity-item__meta-data-item"
            )
            dept_name = ins_dept[0].css("span::text").get()
            address = ins_dept[1].css("span::text").get()
            position = ins_section.css(
                ".nova-legacy-e-list__item.nova-legacy-v-entity-item__info-section-list-item span::text"
            ).get()

            return ProfileCreate(
                name=name,
                profile_pic=profile_pic,
                total_pub=total_pub,
                reads=reads,
                total_citations=total_cit,
                institution=ins_name,
                department=dept_name,
                address=address,
                position=position,
                skills=skills,
            )

        except Exception as e:
            print(f"Error: {e}")
            selector = None
        finally:
            await self.close()

    async def get_publication_details(self, url: str):
        try:
            await self.initialize()
            await self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await self.page.wait_for_timeout(random.randint(2000, 5000))  # Random delay

            content = await self.page.content()
            selector = Selector(text=content)

            pub_abstract = selector.css(".chakra-text.css-8oiimb::text").get()

            return {"abstract": pub_abstract}

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await self.close()

    async def get_publication_ref(self, url: str):
        try:
            await self.initialize()
            await self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await self.page.wait_for_timeout(random.randint(2000, 5000))  # Random delay

            content = await self.page.content()
            selector = Selector(text=content)

            refs_card = selector.css(".chakra-card__body.css-1u34fbw")
            refs = refs_card.css(".css-1fym809")
            references = []
            for ref in refs:
                title = ref.css(".chakra-link.chakra-heading.css-ozdm72::text").get()
                link = ref.css(
                    ".chakra-link.chakra-heading.css-ozdm72::attr(href)"
                ).get()
                authors_card = ref.css(".chakra-stack.css-13nqvds")
                author_name = []
                authors_n = authors_card.css(".chakra-link.css-95mnk0")
                for author in authors_n:
                    author_name.append(author.css("::text").get())

                references.append(
                    {"title": title, "link": link, "authors": author_name}
                )

            return references

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await self.close()
