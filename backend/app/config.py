from pydantic_settings import BaseSettings, SettingsConfigDict


class Setting(BaseSettings):
    POSTGRES_URL: str

    model_config = SettingsConfigDict(env_file="../.env")


Config = Setting()
