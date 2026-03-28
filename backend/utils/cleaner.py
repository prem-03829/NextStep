# import re
# from typing import Optional, Union

# def clean_currency(value: str) -> Optional[float]:
#     """
#     Extracts numerical value from strings like '₹8.5 LPA' or '5,00,000'.
#     Returns float or None.
#     """
#     if not value or not isinstance(value, str):
#         return None
        
#     # Remove currency symbol and commas
#     cleaned = value.replace('₹', '').replace(',', '').strip()
    
#     # Check for LPA/Cr
#     multiplier = 1.0
#     if 'LPA' in cleaned:
#         cleaned = cleaned.replace('LPA', '').strip()
#         # Keep as float in lakhs as per requirements (8.5)
#     elif 'Cr' in cleaned:
#         cleaned = cleaned.replace('Cr', '').strip()
#         multiplier = 100.0 # Convert Cr to LPA (100 Lakhs = 1 Cr)
    
#     try:
#         # Extract first number found
#         match = re.search(r"[-+]?\d*\.\d+|\d+", cleaned)
#         if match:
#             return float(match.group()) * multiplier
#     except ValueError:
#         pass
        
#     return None

# def clean_rank(value: str) -> Optional[int]:
#     """
#     Converts string ranks like '5,000' or '123' to integer.
#     """
#     if not value:
#         return None
#     try:
#         # Remove commas and extract first integer
#         cleaned = re.sub(r'[^\d]', '', str(value))
#         return int(cleaned) if cleaned else None
#     except (ValueError, TypeError):
#         return None

# def clean_text(value: Optional[str]) -> Optional[str]:
#     """Removes extra whitespace and handles missing values."""
#     if not value or not isinstance(value, str):
#         return None
#     return ' '.join(value.split())

# def safe_get(data: dict, key: str, default: any = None) -> any:
#     """Safe retrieval from dictionary."""
#     return data.get(key, default)
