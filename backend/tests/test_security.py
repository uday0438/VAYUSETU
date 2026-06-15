import unittest
import sys
import os
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

class TestSecurityCryptography(unittest.TestCase):
    def test_password_hashing(self):
        """Test that password hashing and verification works securely."""
        password = "my_secure_hackathon_password_123"
        hashed = hash_password(password)
        
        # Ensure hash doesn't contain the raw password
        self.assertNotIn(password, hashed)
        self.assertTrue(hashed.startswith("pbkdf2_sha256$"))
        
        # Verify success case
        self.assertTrue(verify_password(password, hashed))
        
        # Verify fail case
        self.assertFalse(verify_password("wrong_password", hashed))

    def test_jwt_creation_and_decoding(self):
        """Test token creation, signing, and signature/expiry validation."""
        data = {"user_id": 42, "role": "admin"}
        
        # Create token
        token = create_access_token(data, expires_delta=10) # 10 seconds expiry
        self.assertIsNotNone(token)
        self.assertEqual(len(token.split('.')), 3)
        
        # Decode and verify payload
        decoded = decode_access_token(token)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["user_id"], 42)
        self.assertEqual(decoded["role"], "admin")
        self.assertIn("exp", decoded)
        
        # Verify invalid token returns None
        self.assertNil = decode_access_token("invalid.token.signature")
        self.assertIsNone(self.assertNil)
        
        # Verify expired token validation
        expired_token = create_access_token(data, expires_delta=-10) # Expired 10 seconds ago
        decoded_expired = decode_access_token(expired_token)
        self.assertIsNone(decoded_expired)

if __name__ == "__main__":
    unittest.main()
