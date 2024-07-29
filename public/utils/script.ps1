Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class Win32 {
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern int GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetWindowInfo(IntPtr hWnd, ref WINDOWINFO pwi);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetMonitorInfo(IntPtr hMonitor, ref MONITORINFO lpmi);
    [DllImport("user32.dll")]
    public static extern IntPtr MonitorFromWindow(IntPtr hwnd, uint dwFlags);
    public const uint MONITOR_DEFAULTTONEAREST = 0x00000002;

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
      public int Left;
      public int Top;
      public int Right;
      public int Bottom;
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct WINDOWINFO {
      public uint cbSize;
      public RECT rcWindow;
      public RECT rcClient;
      public uint dwStyle;
      public uint dwExStyle;
      public uint dwWindowStatus;
      public uint cxWindowBorders;
      public uint cyWindowBorders;
      public ushort atomWindowType;
      public ushort wCreatorVersion;
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct MONITORINFO {
      public uint cbSize;
      public RECT rcMonitor;
      public RECT rcWork;
      public uint dwFlags;
    }
  }
"@

Add-Type -AssemblyName System.Windows.Forms

$screenWidth = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
$screenHeight = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height
$isFullscreen = $false
$monitorName = ""

$monitorNames = @("Monitor 1", "Monitor 2", "Monitor 3", "Monitor 4")

$callback = {
  param ($hWnd, $lParam)
  if ([Win32]::IsWindowVisible($hWnd)) {
    $rect = New-Object Win32+RECT
    [Win32]::GetWindowRect($hWnd, [ref]$rect)
    $windowWidth = $rect.Right - $rect.Left
    $windowHeight = $rect.Bottom - $rect.Top

    if ($windowWidth -eq $screenWidth -and $windowHeight -eq $screenHeight) {
      $windowInfo = New-Object Win32+WINDOWINFO
      $windowInfo.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf($windowInfo)
      [Win32]::GetWindowInfo($hWnd, [ref]$windowInfo)

      # Check if the window has no borders or title bar
      $hasBorders = ($windowInfo.dwStyle -band 0x00C00000) -ne 0
      $isFullscreenWindow = -not $hasBorders

      if ($isFullscreenWindow) {
        $script:isFullscreen = $true

        $monitorHandle = [Win32]::MonitorFromWindow($hWnd, [Win32]::MONITOR_DEFAULTTONEAREST)
        $monitorInfoStruct = New-Object Win32+MONITORINFO
        $monitorInfoStruct.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf($monitorInfoStruct)
        if ([Win32]::GetMonitorInfo($monitorHandle, [ref]$monitorInfoStruct)) {
          $monitorRect = $monitorInfoStruct.rcMonitor
          $screenBounds = [System.Windows.Forms.Screen]::AllScreens | Where-Object {
            $_.Bounds.Left -eq $monitorRect.Left -and
            $_.Bounds.Top -eq $monitorRect.Top
          }
          $monitorIndex = [System.Windows.Forms.Screen]::AllScreens.IndexOf($screenBounds) + 1
          $script:monitorName = "Monitor $monitorIndex"
        } else {
          $script:monitorName = "Monitor information not available."
        }

        return $false
      }
    }
  }
  return $true
}

[Win32]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null
return "$isFullscreen`n$monitorName"