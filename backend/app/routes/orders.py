from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order, User, Listing
from app.schemas.order import OrderRead, OrderCreate
from app.lib.jwt import get_user_id

router = APIRouter(prefix="/orders", tags=["orders"])

# * GET Routes


@router.get("/", response_model=list[OrderRead])
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found")
    return orders


@router.get("/{order_id}", response_model=OrderRead)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=OrderRead)
def create_order(
    order: OrderCreate,
    user_id: int = Depends(get_user_id),
    db: Session = Depends(get_db),
):
    if user_id != order.buyer_id:
        raise HTTPException(status_code=403, detail="Not authenticated")
    existing_listing = db.query(Listing).filter(Listing.id == order.listing_id).first()
    if not existing_listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    existing_order = db.query(Order).filter(Order.listing_id == order.listing_id)
    if existing_order:
        raise HTTPException(status_code=400, detail="Order already exists")

    new_order = Order(
        price=existing_listing.price,
        quality=existing_listing.quality,
        description=existing_listing.description,
        release_id=order.release_id,
        seller_id=order.seller_id,
        buyer_id=order.buyer_id,
    )
    try:
        db.add(new_order)
        db.delete(existing_listing)
        db.commit()
        db.refresh(new_order)
    except Exception as e:
        db.rollback()
        print(f"Failed to update database: {e}")

    return new_order
