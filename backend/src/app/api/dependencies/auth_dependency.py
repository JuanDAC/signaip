from fastapi import Header, HTTPException, Depends
from app.domain.ports.auth_port import AuthPort
from app.container import injector

def get_auth() -> AuthPort:
    return injector.get(AuthPort)

def verify_api_key(x_api_key: str = Header(..., alias="x-api-key"), auth: AuthPort = Depends(get_auth)):
    if not auth.validate_api_key(x_api_key):
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return True
