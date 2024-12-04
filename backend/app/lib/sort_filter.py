from multiprocessing import Value
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
        limit: int = Query(50, ge=1, le=100),
        sort: list[str] = Query([]),
        order: list[str] = Query([]),
    ):
        self.page: int = page
        self.limit: int = limit
        self.sort: list[str] = sort
        self.order: list[str] = order

        if len(self.sort) != len(self.order):
            raise ValueError("Sort and order lists must have the same length")


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
    sort: list[str] | None = None,
    order: list[str] | None = None,
) -> PaginationResult:
    page = max(page, 1)
    limit = max(limit, 1)

    if sort and order:
        if len(sort) != len(order):
            raise ValueError("Sort and order lists must have the same length")
        for field, dir in zip(sort, order):
            query = query.order_by(
                asc(text(field)) if dir == "asc" else desc(text(field))
            )

    total_entries: int = query.count()
    print(total_entries)
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
    default_sort: list[str] | None = None,
    default_order: list[str] | None = None,
    max_limit: int = 100,
) -> Callable:
    def pagination_dependency(
        page: int = Query(default_page, ge=1),
        limit: int = Query(default_limit, ge=1, le=max_limit),
        sort: list[str] = Query(default_sort),
        order: list[str] = Query(default_order),
    ) -> PaginationParams:
        return PaginationParams(page=page, limit=limit, sort=sort, order=order)

    return pagination_dependency
