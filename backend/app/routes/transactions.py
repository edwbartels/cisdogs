from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction, User, Listing
from app.schemas.transaction import TransactionRead, TransactionCreate
from app.lib.jwt import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[TransactionRead])
def get_all_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found")
    return transactions


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction_by_id(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.post("/", response_model=TransactionRead)
def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != transaction.buyer_id:
        raise HTTPException(
            status_code=403, detail="Only the buyer can initiate a transaction"
        )
    existing_listing = (
        db.query(Listing).filter(Listing.id == transaction.listing_id).first()
    )
    if not existing_listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    existing_transaction = db.query(Transaction).filter(
        Transaction.listing_id == transaction.listing_id
    )
    if existing_transaction:
        raise HTTPException(status_code=400, detail="Transaction already exists")

    new_transaction = Transaction(
        price=transaction.price,
        seller_id=transaction.seller_id,
        buyer_id=transaction.buyer_id,
        listing_id=transaction.listing_id,
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction
