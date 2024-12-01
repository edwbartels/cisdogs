from fastapi import Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from sqlalchemy.sql import text
from typing import Any, Callable, Generic, TypeVar

T = TypeVar("T")


class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1),
        limit: int = Query(20, ge=1, le=100),
        sort: str | None = Query(None),
        order: str = Query("desc", regex="^(asc|desc)$"),
    ):
        self.page: int = page
        self.limit: int = limit
        self.sort: str | None = sort
        self.order: str = order


class PaginationResult(BaseModel, Generic[T]):
    entries: dict[str, T]
    total_entries: int
    total_pages: int
    current_page: int
    has_more: bool
    sorted_ids: list[int]


def paginate(
    query,
    page: int = 1,
    limit: int = 30,
    sort: str | None = None,
    order: str = "desc",
) -> PaginationResult:
    page = max(page, 1)
    limit = max(limit, 1)

    if sort:
        query = query.order_by(asc(text(sort)) if order == "asc" else desc(text(sort)))

    total_entries: int = query.count()
    offset: int = (page - 1) * limit
    entries: Any = query.offset(offset).limit(limit).all()

    total_pages: int = (total_entries + limit - 1) // limit
    has_more: bool = page < total_pages
    return PaginationResult(
        entries={str(entry.id): entry for entry in entries},
        total_entries=total_entries,
        total_pages=total_pages,
        current_page=page,
        has_more=has_more,
        sorted_ids=[entry.id for entry in entries],
    )


def create_pagination_params(
    default_page: int = 1,
    default_limit: int = 20,
    default_sort: str | None = None,
    default_order: str = "asc",
    max_limit: int = 100,
) -> Callable:
    def pagination_dependency(
        page: int = Query(default_page, ge=1),
        limit: int = Query(default_limit, ge=1, le=max_limit),
        sort: str = Query(default_sort),
        order: str = Query(default_order, regex="^(asc|desc)$"),
    ) -> PaginationParams:
        return PaginationParams(page=page, limit=limit, sort=sort, order=order)

    return pagination_dependency
