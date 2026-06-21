import hashlib

class ModelIntegrityChecker:
    def verify_file_hash(self, file_path: str, expected_hash: str) -> bool:
        try:
            sha = hashlib.sha256()
            with open(file_path, "rb") as f:
                while chunk := f.read(8192):
                    sha.update(chunk)
            return sha.hexdigest() == expected_hash
        except FileNotFoundError:
            return False
