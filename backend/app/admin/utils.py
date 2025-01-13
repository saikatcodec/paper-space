from dateutil.parser import parse
from datetime import date


def parse_date(date_str: str) -> date:
    try:
        parsed_date = parse(date_str, fuzzy=True).date()
        return parsed_date
    except Exception as e:
        raise ValueError(f"Invalid date format: {date_str}") from e
