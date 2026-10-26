import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Email the customer their weighed invoice PDF (generated in the admin panel).
 *
 * Convex env required:
 * - RESEND_API_KEY
 * - INVOICE_FROM_EMAIL (preferred), e.g. "Steak-Out <invoices@yourdomain.com>"
 */
export const sendInvoice = action({
  args: {
    orderId: v.id("orders"),
    pdfBase64: v.string(),
    invoiceNumber: v.string(),
    subject: v.string(),
    bodyText: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(api.adminOrders.get, {
      orderId: args.orderId,
    });
    if (!order) {
      throw new Error("Order not found");
    }

    const to = order.customerEmail.trim().toLowerCase();
    if (!to) {
      throw new Error("Order has no customer email");
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Email is not configured. Set RESEND_API_KEY in Convex environment variables.",
      );
    }

    const from =
      process.env.INVOICE_FROM_EMAIL?.trim() ||
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Steak-Out <onboarding@resend.dev>";

    const pdfBase64 = args.pdfBase64.replace(
      /^data:application\/pdf;base64,/,
      "",
    );
    if (!pdfBase64 || pdfBase64.length < 32) {
      throw new Error("Invoice PDF is missing or invalid");
    }
    if (pdfBase64.length > 4_000_000) {
      throw new Error("Invoice PDF is too large to email");
    }

    const subject = args.subject.trim() || `Your Steak-Out invoice #${args.invoiceNumber}`;
    const bodyText = args.bodyText.trim();
    if (!bodyText) {
      throw new Error("Email body is empty");
    }

    const html = plainTextToEmailHtml(bodyText);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text: bodyText,
        attachments: [
          {
            filename: `steakout-invoice-${args.invoiceNumber}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(
        `Failed to send invoice email (${res.status}): ${detail.slice(0, 400)}`,
      );
    }

    return { ok: true as const, to };
  },
});

function plainTextToEmailHtml(bodyText: string): string {
  const escaped = escapeHtml(bodyText).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border:2px solid #0B0B0B;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#0B0B0B;padding:20px 24px;">
                <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">STEAK-OUT</p>
                <p style="margin:6px 0 0;font-size:13px;color:#cccccc;">Invoice</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font-size:14px;color:#333;line-height:1.6;">
                ${escaped}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
