from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class Brand:
    id: Optional[int]
    name: str
    country: str
    status: str = "Pendiente"
