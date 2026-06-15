import hmac
import hashlib
import base64
import json
import time
import os
from typing import Optional, Dict, Any
from app.core.config import settings

def hash_password(password: str) -> str:
    """
    Securely hashes a password using PBKDF2 with SHA256 and a random salt.
    Avoids plain storage and provides high security with zero external dependencies.
    """
    salt = os.urandom(16)
    db_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    # Combine salt and hash into a single string for storage
    return f"pbkdf2_sha256$100000${base64.b64encode(salt).decode('utf-8')}${base64.b64encode(db_hash).decode('utf-8')}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored pbkdf2 hash."""
    try:
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != 'pbkdf2_sha256':
            return False
        iterations = int(parts[1])
        salt = base64.b64decode(parts[2])
        stored_hash = base64.b64decode(parts[3])
        
        test_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, iterations)
        return hmac.compare_digest(stored_hash, test_hash)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[float] = None) -> str:
    """
    Creates a secure signed JSON Web Token (JWT) using HMAC-SHA256.
    Follows secure coding standards without requiring the 'python-jose' package.
    """
    payload = data.copy()
    if expires_delta:
        expire = time.time() + expires_delta
    else:
        expire = time.time() + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
        
    payload.update({"exp": expire})
    
    # Standard JWT components
    header = {"alg": "HS256", "typ": "JWT"}
    
    # Base64url encode header and payload
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    
    encoded_header = base64.urlsafe_b64encode(header_json).decode('utf-8').replace('=', '')
    encoded_payload = base64.urlsafe_b64encode(payload_json).decode('utf-8').replace('=', '')
    
    signature_base = f"{encoded_header}.{encoded_payload}".encode('utf-8')
    
    # Sign token using secret key
    key = settings.SECRET_KEY.encode('utf-8')
    signature = hmac.new(key, signature_base, hashlib.sha256).digest()
    encoded_signature = base64.urlsafe_b64encode(signature).decode('utf-8').replace('=', '')
    
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a signed JWT token. Returns payload if valid, else None."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
            
        encoded_header, encoded_payload, encoded_signature = parts
        signature_base = f"{encoded_header}.{encoded_payload}".encode('utf-8')
        
        # Verify signature
        key = settings.SECRET_KEY.encode('utf-8')
        expected_sig = hmac.new(key, signature_base, hashlib.sha256).digest()
        # Add padding back before decoding
        pad_len = (4 - len(encoded_signature) % 4) % 4
        decoded_sig = base64.urlsafe_b64decode(encoded_signature + '=' * pad_len)
        
        if not hmac.compare_digest(expected_sig, decoded_sig):
            return None
            
        # Decode payload
        pad_len = (4 - len(encoded_payload) % 4) % 4
        payload_json = base64.urlsafe_b64decode(encoded_payload + '=' * pad_len).decode('utf-8')
        payload = json.loads(payload_json)
        
        # Check expiration
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None
