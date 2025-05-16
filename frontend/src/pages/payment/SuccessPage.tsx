import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");
        const paymentKey = searchParams.get("paymentKey");

        if (!orderId || !amount || !paymentKey) {
            alert("❌ 필수 결제 정보가 누락되었습니다.");
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        let alreadyConfirmed = false;

        const confirm = async () => {
            if (alreadyConfirmed) return;
            alreadyConfirmed = true;

            try {
                const response = await fetch("http://localhost:8700/api/payments/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ orderId, amount, paymentKey }),
                });

                console.log("📦 요청 보냄:", { orderId, amount, paymentKey });
                console.log("🔄 응답 상태:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("❌ 결제 실패 응답:", errorText);
                    navigate(`/fail?message=${encodeURIComponent("결제확인실패")}&code=${response.status}`);
                    return;
                }

                const json = await response.json();
                console.log("✅ 결제 성공:", json);

                // 이곳에서 포인트 적립 등 후속 처리를 추가할 수 있음
            } catch (err) {
                console.error("❌ 서버 요청 실패:", err);
                navigate(`/fail?message=${encodeURIComponent("서버오류")}&code=500`);
            }
        };

        const timer = setTimeout(confirm, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="result wrapper">
            <div className="box_section">
                <h2>결제 성공</h2>
                <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
                <p>{`결제 금액: ${Number(searchParams.get("amount") || "0").toLocaleString()}원`}</p>
            </div>
        </div>
    );
}

export default SuccessPage;
