import ctypes
from ctypes import wintypes

advapi32 = ctypes.windll.advapi32

class CREDENTIAL_ATTRIBUTE(ctypes.Structure):
    _fields_ = [
        ('Keyword', wintypes.LPWSTR),
        ('Flags', wintypes.DWORD),
        ('ValueSize', wintypes.DWORD),
        ('Value', ctypes.POINTER(ctypes.c_byte)),
    ]

class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ('Flags', wintypes.DWORD),
        ('Type', wintypes.DWORD),
        ('TargetName', wintypes.LPWSTR),
        ('Comment', wintypes.LPWSTR),
        ('LastWritten', wintypes.FILETIME),
        ('CredentialBlobSize', wintypes.DWORD),
        ('CredentialBlob', ctypes.POINTER(ctypes.c_byte)),
        ('Persist', wintypes.DWORD),
        ('AttributeCount', wintypes.DWORD),
        ('Attributes', ctypes.POINTER(CREDENTIAL_ATTRIBUTE)),
        ('TargetAlias', wintypes.LPWSTR),
        ('UserName', wintypes.LPWSTR),
    ]

PCREDENTIAL = ctypes.POINTER(CREDENTIAL)

advapi32.CredReadW.argtypes = [wintypes.LPWSTR, wintypes.DWORD, wintypes.DWORD, ctypes.POINTER(PCREDENTIAL)]
advapi32.CredReadW.restype = wintypes.BOOL

advapi32.CredFree.argtypes = [ctypes.c_void_p]

# Read target GitHub - https://api.github.com/adnin4
target_name = "GitHub - https://api.github.com/adnin4"
pcred = PCREDENTIAL()

if advapi32.CredReadW(target_name, 1, 0, ctypes.byref(pcred)):
    cred = pcred.contents
    blob_bytes = bytes(cred.CredentialBlob[:cred.CredentialBlobSize])
    # GitHub Desktop OAuth token is stored as utf-8 or utf-16
    try:
        secret = blob_bytes.decode('utf-8')
    except:
        secret = blob_bytes.decode('utf-16le')
    print("USER:", cred.UserName)
    print("TOKEN_LENGTH:", len(secret))
    print("TOKEN_VAL:", secret)
    advapi32.CredFree(pcred)
else:
    print("CredReadW failed!")
