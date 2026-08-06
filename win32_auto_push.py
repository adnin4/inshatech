import ctypes, time

user32 = ctypes.windll.user32

hwnds = []
def enum_windows_callback(h, l):
    length = user32.GetWindowTextLengthW(h)
    if length > 0:
        buff = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(h, buff, length + 1)
        if "inshatech" in buff.value.lower() or "github desktop" in buff.value.lower():
            hwnds.append(h)
    return True

EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_int, ctypes.c_int)
user32.EnumWindows(EnumWindowsProc(enum_windows_callback), 0)

print("Found HWNDs:", hwnds)

if hwnds:
    hwnd = hwnds[0]
    user32.ShowWindow(hwnd, 9) # SW_RESTORE
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.5)

    # Key constants
    VK_CONTROL = 0x11
    VK_P = 0x50
    KEYEVENTF_KEYUP = 0x0002

    # Press Ctrl+P
    user32.keybd_event(VK_CONTROL, 0, 0, 0)
    user32.keybd_event(VK_P, 0, 0, 0)
    time.sleep(0.1)
    user32.keybd_event(VK_P, 0, KEYEVENTF_KEYUP, 0)
    user32.keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0)
    print("Sent Ctrl+P successfully!")
else:
    print("GitHub Desktop window not found!")
