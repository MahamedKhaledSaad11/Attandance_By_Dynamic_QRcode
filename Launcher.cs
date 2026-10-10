using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace AttendanceAppLauncher
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string indexPath = Path.Combine(baseDir, "index.html");

                if (!File.Exists(indexPath))
                {
                    MessageBox.Show(
                        "لم يتم العثور على ملف index.html في نفس المجلد!\nيرجى التأكد من عدم نقل ملف الـ exe خارج المجلد.",
                        "خطأ في التشغيل",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error
                    );
                    return;
                }

                string fileUri = new Uri(indexPath).AbsoluteUri;

                // البحث عن مسار Microsoft Edge
                string edgePath86 = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
                string edgePath64 = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
                string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
                string chromePath86 = @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";

                string targetBrowser = null;

                if (File.Exists(edgePath86)) targetBrowser = edgePath86;
                else if (File.Exists(edgePath64)) targetBrowser = edgePath64;
                else if (File.Exists(chromePath)) targetBrowser = chromePath;
                else if (File.Exists(chromePath86)) targetBrowser = chromePath86;

                if (!string.IsNullOrEmpty(targetBrowser))
                {
                    // تشغيل في وضع التطبيق المستقل (بدون أشرطة متصفح أو عناوين)
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = targetBrowser,
                        Arguments = string.Format("--app=\"{0}\" --window-size=1280,820", fileUri),
                        UseShellExecute = true
                    };
                    Process.Start(psi);
                }
                else
                {
                    // المتصفح الافتراضي في حال عدم وجود مسارات ثابتة
                    Process.Start(new ProcessStartInfo(fileUri) { UseShellExecute = true });
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("حدث خطأ أثناء التشغيل:\n" + ex.Message, "تنبيه", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
    }
}
