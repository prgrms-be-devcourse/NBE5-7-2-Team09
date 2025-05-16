import { useEffect, useRef } from "react";
import { loadPaymentWidget, type PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { useLocation } from "react-router-dom";
import { nanoid } from "nanoid";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 토스 테스트 키
const customerKey = "customer123";

export default function CheckoutPage() {
    const { state } = useLocation();
    const amount = state?.amount || 0;

    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null); // ✅ 타입 명시

    useEffect(() => {
        (async () => {
            try {
                const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
                paymentWidgetRef.current = paymentWidget;

                await paymentWidget.renderPaymentMethods("#payment-method", {
                    value: amount,
                });
                await paymentWidget.renderAgreement("#agreement");
            } catch (err) {
                console.error("❌ Toss 위젯 로딩 실패:", err);
            }
        })();
    }, [amount]);

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current;

        if (!paymentWidget) {
            alert("결제 위젯이 아직 초기화되지 않았습니다.");
            return;
        }

        if (!amount || amount < 1000) {
            alert("충전 금액이 올바르지 않습니다.");
            return;
        }

        try {
            await paymentWidget.requestPayment({
                orderId: nanoid(),
                orderName: "포인트 충전",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
            });
        } catch (error) {
            console.error("❌ 결제 요청 에러:", error);
            alert("결제 요청 중 문제가 발생했습니다.");
        }
    };

    return (
        <div>
            <h2>결제 수단 선택</h2>
            <div id="payment-method" />
            <div id="agreement" />
            <button
                onClick={handlePayment}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-4">
                결제하기
            </button>
        </div>
    );
}
