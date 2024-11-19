from passlib.hash import bcrypt


def hash_password(plaintext_password: str) -> str:
    return bcrypt.hash(plaintext_password)


def verify_password(plaintext_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plaintext_password, hashed_password)
