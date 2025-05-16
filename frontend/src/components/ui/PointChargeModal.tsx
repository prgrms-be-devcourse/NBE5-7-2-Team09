import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    totalCharge: number;
    setTotalCharge: (amount: number) => void;
    userPoint: number;
    onSubmit: () => void;  // CheckoutPage로 이동하는 함수
}

export default function PointChargeModal({
                                             isOpen,
                                             onClose,
                                             totalCharge,
                                             setTotalCharge,
                                             onSubmit,
                                             userPoint,
                                         }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-[360px] p-6 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-lg font-bold text-center mb-4">포인트 충전</h2>

                <div className="text-center text-blue-700 font-semibold mb-2">
                    충전 후 예상 포인트: {(userPoint + totalCharge).toLocaleString()}P
                </div>

                <div className="flex justify-center gap-4 mb-4">
                    <Button onClick={() => setTotalCharge(totalCharge + 5000)}>
                        +5,000원
                    </Button>
                    <Button onClick={() => setTotalCharge(totalCharge + 10000)}>
                        +10,000원
                    </Button>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        취소
                    </Button>
                    <Button onClick={onSubmit} disabled={totalCharge === 0}>
                        다음
                    </Button>
                </div>
            </div>
        </div>
    );
}
