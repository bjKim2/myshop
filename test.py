import hmac
import hashlib
import base64

# 메시지와 시크릿 키
message = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzFkMDBhZjVjN2RmOWU0NGVjM2RlZjEiLCJpYXQiOjE3Mjk5NTM5NzMsImV4cCI6MTcyOTk2NDc3M30"
secret_key = "bigeyesbaby"

print(message.encode())
# HMAC-SHA256 해시 생성
signature = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).digest()

# Base64 URL-safe로 인코딩
encoded_signature = base64.urlsafe_b64encode(signature).rstrip(b"=").decode()

print(encoded_signature == 'cbkIsR72soZetBD6phfajUHxc51LLE8aAEgM-xQZAYc')