from pydantic import BaseModel


class WatchReq(BaseModel):
    user_id: int
    release_id: int
