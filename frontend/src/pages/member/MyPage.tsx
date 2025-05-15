import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  CreditCard,
  Edit2,
  User,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  getUserProfile,
  updateUserProfile,
  getUserSubscription,
  startSubscription,
  cancelSubscription,
} from "@/utils/api/userService";
import { UserProfile, ProfileUpdateRequest, Subscription } from "@/types/user";

const MyPage: React.FC = () => {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 유저 정보 상태
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: "",
    email: "",
    phoneNumber: "",
    point: 0,
  });

  // 구독 정보 상태
  const [subscription, setSubscription] = useState<Subscription>({
    isActive: false,
    plan: undefined,
    startDate: undefined,
    endDate: undefined,
    price: undefined,
  });

  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 수정할 데이터를 임시로 저장할 상태
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    ...userProfile,
  });

  // 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // 회원 정보 조회
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 회원 정보와 구독 정보 병렬로 가져오기
        const [profileData, subscriptionData] = await Promise.all([
          getUserProfile(),
          getUserSubscription(),
        ]);

        // 회원 정보 설정 (API에서 반환된 정보가 없는 경우 기본값 유지)
        if (profileData) {
          setUserProfile({
            nickname: profileData.nickname || "",
            email: profileData.email || "",
            phoneNumber: profileData.phoneNumber || "",
            point: profileData.point || 0, // API에서 반환하는 이름 그대로 사용
          });
        }

        if (subscriptionData) {
          setSubscription(subscriptionData);

          // 구독이 활성화되어 있고 만료일이 7일 이내인 경우 알림
          if (subscriptionData.isActive && subscriptionData.endDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endDate = new Date(subscriptionData.endDate);
            endDate.setHours(0, 0, 0, 0);

            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0 && diffDays <= 7) {
              toast.warning("구독 만료 예정", {
                description: `구독이 ${diffDays}일 후에 만료됩니다. 자동 갱신되지 않으니 필요한 경우 갱신해주세요.`,
                duration: 5000,
              });
            }
          }
        }
      } catch (error) {
        console.error("데이터를 가져오는 데 실패했습니다.", error);
        toast.error("데이터 로딩 실패", {
          description:
            "회원 정보를 불러오는 중 오류가 발생했습니다. 새로고침 해주세요.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 수정 모드 시작
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile({ ...userProfile });
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 프로필 필드 변경 핸들러
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  // 수정 완료
  const handleSaveProfile = async () => {
    setIsSubmitting(true);

    try {
      // API로 전송할 데이터 객체 (변경된 필드만 포함)
      const updateData: ProfileUpdateRequest = {};

      // 닉네임이 변경되었는지 확인
      if (editedProfile.nickname !== userProfile.nickname) {
        updateData.nickname = editedProfile.nickname;
      }

      // 전화번호가 변경되었는지 확인
      if (editedProfile.phoneNumber !== userProfile.phoneNumber) {
        updateData.phoneNumber = editedProfile.phoneNumber;
      }

      // 변경된 데이터가 있는 경우에만 API 호출
      if (Object.keys(updateData).length > 0) {
        const updatedProfile = await updateUserProfile(updateData);
        setUserProfile(updatedProfile);
        toast.success("프로필 업데이트 완료", {
          description: "회원 정보가 성공적으로 업데이트되었습니다.",
        });
      } else {
        toast.info("변경사항 없음", {
          description: "변경된 정보가 없습니다.",
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("프로필 업데이트에 실패했습니다.", error);
      toast.error("업데이트 실패", {
        description:
          "회원 정보 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 구독 시작 핸들러
  const handleStartSubscription = async () => {
    setIsSubscribing(true);

    try {
      const result = await startSubscription();

      if (result.success) {
        // 구독 정보 다시 가져오기
        const subscriptionData = await getUserSubscription();
        if (subscriptionData) {
          setSubscription(subscriptionData);
        }

        toast.success("구독 신청 완료", {
          description:
            result.message || "프리미엄 구독이 성공적으로 시작되었습니다.",
        });
      } else {
        toast.error("구독 신청 실패", {
          description:
            result.message ||
            "구독 신청 중 오류가 발생했습니다. 다시 시도해 주세요.",
        });
      }
    } catch (error) {
      console.error("구독 시작에 실패했습니다.", error);
      toast.error("구독 신청 실패", {
        description: "구독 신청 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // 구독 취소 핸들러
  const handleCancelSubscription = async () => {
    // 현재 구독이 없거나 이미 취소된 경우
    if (!subscription.isActive) {
      toast.error("구독 취소 실패", {
        description: "현재 활성화된 구독이 없습니다.",
      });
      return;
    }

    // 사용자에게 확인 요청
    const confirmCancel = window.confirm("정말로 구독을 취소하시겠습니까?");
    if (!confirmCancel) return;

    setIsCancelling(true);

    try {
      // API 문서에 따르면 구독 ID는 1로 고정된 것으로 보임
      // 실제 환경에서는 구독 ID를 동적으로 가져오는 로직 필요
      const subscriptionId = 1;
      const result = await cancelSubscription(subscriptionId);

      if (result.success) {
        // 구독 정보 업데이트 - isActive를 false로 설정하지만 stillValid는 유지
        setSubscription({
          ...subscription,
          isActive: false,
        });

        toast.success("구독 취소 완료", {
          description:
            result.message ||
            "구독이 성공적으로 취소되었습니다. 만료일까지는 서비스를 이용하실 수 있습니다.",
        });
      } else {
        toast.error("구독 취소 실패", {
          description:
            result.message ||
            "구독 취소 중 오류가 발생했습니다. 다시 시도해 주세요.",
        });
      }
    } catch (error) {
      console.error("구독 취소에 실패했습니다.", error);
      toast.error("구독 취소 실패", {
        description: "구독 취소 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // 구독 변경 핸들러 (실제 API가 없어 구현하지 않음)
  const handleChangeSubscription = () => {
    toast.info("현재 지원하지 않는 기능입니다", {
      description: "곧 업데이트될 예정입니다.",
    });
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 남은 일수 계산 함수
  const calculateDaysRemaining = (endDateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간, 분, 초, 밀리초를 0으로 설정하여 오늘 날짜만 비교

    const endDate = new Date(endDateString);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return "구독이 만료되었습니다";
    } else if (diffDays === 1) {
      return "오늘 만료됩니다";
    } else if (diffDays <= 7) {
      return `만료까지 ${diffDays}일 남았습니다`;
    } else {
      return `만료까지 ${diffDays}일 남았습니다`;
    }
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600">
            회원 정보를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            회원 정보
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard size={16} />
            구독 현황
          </TabsTrigger>
        </TabsList>

        {/* 회원 정보 탭 */}
        <TabsContent value="profile">
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">회원 정보</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center gap-1"
                >
                  <Edit2 size={16} />
                  수정
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="mr-1 animate-spin" />
                    ) : (
                      <Check size={16} className="mr-1" />
                    )}
                    저장
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 이메일 (수정 불가) */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  이메일은 변경할 수 없습니다. 고객센터에 문의하세요.
                </p>
              </div>

              {/* 닉네임 (수정 가능) */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                {isEditing ? (
                  <Input
                    id="nickname"
                    name="nickname"
                    value={editedProfile.nickname}
                    onChange={handleProfileChange}
                    placeholder="닉네임을 입력하세요"
                    className="focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <Input id="nickname" value={userProfile.nickname} disabled />
                )}
              </div>

              {/* 핸드폰 번호 (수정 가능) */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">핸드폰 번호</Label>
                {isEditing ? (
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editedProfile.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="010-0000-0000"
                    className="focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <Input
                    id="phoneNumber"
                    value={userProfile.phoneNumber}
                    disabled
                  />
                )}
              </div>

              {/* 포인트 (수정 불가) */}
              <div className="space-y-2">
                <Label htmlFor="point">포인트</Label>
                <Input
                  id="point"
                  value={
                    userProfile.point
                      ? `${userProfile.point.toLocaleString()}P`
                      : "0P"
                  }
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 구독 현황 탭 */}
        <TabsContent value="subscription">
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-lg">구독 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription.stillValid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {subscription.plan || "Premium"} 플랜
                    </span>
                    <Badge className="bg-green-600 py-1">구독 중</Badge>
                    {!subscription.isActive && (
                      <Badge className="bg-orange-500 py-1">해지 예정</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">
                        구독 시작일
                      </Label>
                      <p className="font-medium">
                        {formatDate(subscription.startDate)}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-500">
                        구독 종료일
                      </Label>
                      <p className="font-medium">
                        {formatDate(subscription.endDate)}
                      </p>

                      {subscription.endDate && (
                        <div className="mt-1 flex items-center gap-1">
                          <Calendar size={14} className="text-orange-600" />
                          <p className="text-xs text-orange-600 font-medium">
                            {calculateDaysRemaining(subscription.endDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-gray-500">
                        월 결제 금액
                      </Label>
                      <p className="font-medium">
                        {subscription.price
                          ? `${subscription.price.toLocaleString()}원`
                          : "14,900원"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {!subscription.isActive ? (
                      <div className="flex items-center text-gray-500">
                        <p className="text-sm">
                          이미 해지 신청이 완료되었습니다. 만료일까지 서비스를
                          이용하실 수 있습니다.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleChangeSubscription}
                        >
                          구독 변경
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                        >
                          {isCancelling ? (
                            <Loader2 size={16} className="mr-1 animate-spin" />
                          ) : null}
                          구독 해지
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-amber-50 border-amber-200 text-amber-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      현재 구독 중인 플랜이 없습니다. 다양한 혜택을 누리시려면
                      구독을 시작해보세요.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-purple-300 hover:shadow-md transition-all cursor-pointer pt-0 border-0">
                      <CardHeader className="bg-purple-50 rounded-t-lg pb-0 gap-0">
                        <CardTitle className="text-center text-purple-700 p-2">
                          Premium
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-center mb-4">
                          <p className="text-2xl font-bold">
                            14,900원
                            <span className="text-sm font-normal">/월</span>
                          </p>
                        </div>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-center gap-2">
                            <Check size={16} className="text-green-600" />
                            <span>무제한 대여</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={16} className="text-green-600" />
                            <span>프리미엄 도서 열람</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={16} className="text-green-600" />
                            <span>오디오북 무제한</span>
                          </li>
                        </ul>
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={handleStartSubscription}
                          disabled={isSubscribing}
                        >
                          {isSubscribing ? (
                            <Loader2 size={16} className="mr-1 animate-spin" />
                          ) : null}
                          시작하기
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <section className="mt-8">
                    <h2 className="text-xl font-bold mb-4">
                      이벤트 및 프로모션
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-bold mb-2">
                          첫 가입 30일 무료
                        </h3>
                        <p className="mb-4">
                          지금 가입하시면 30일간 무료로 모든 도서를 이용할 수
                          있습니다.
                        </p>
                        <Button className="bg-white text-purple-700 hover:bg-gray-100">
                          자세히 보기
                        </Button>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyPage;
