import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CreditCard, Edit2, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// 타입 정의
interface UserProfile {
  nickname: string;
  email: string;
  phoneNumber: string;
  points: number;
}

interface Subscription {
  isActive: boolean;
  plan?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
}

const MyPage: React.FC = () => {
  // 유저 정보 상태
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: "북러버",
    email: "bookspace@example.com",
    phoneNumber: "010-1234-5678",
    points: 3500,
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

  // 데이터 가져오기 (실제 환경에서는 API 호출)
  useEffect(() => {
    // 여기서 실제 API 호출을 하게 됩니다.
    // 예시 코드이므로 실제 구현 시 API 호출 코드로 대체해야 합니다.
    const fetchUserData = async () => {
      try {
        // API 호출 예시
        // const response = await axios.get('/api/user/profile');
        // setUserProfile(response.data.profile);
        // setSubscription(response.data.subscription);
      } catch (error) {
        console.error("사용자 데이터를 가져오는 데 실패했습니다.", error);
      }
    };

    fetchUserData();
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
    try {
      // 여기서 실제 API 호출을 하게 됩니다.
      // const response = await axios.put('/api/user/profile', editedProfile);

      // API 응답 대신 임시로 상태 업데이트
      setUserProfile(editedProfile);
      setIsEditing(false);

      toast.success("프로필 업데이트 완료", {
        description: "회원 정보가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      console.error("프로필 업데이트에 실패했습니다.", error);
      toast.error("업데이트 실패", {
        description:
          "회원 정보 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  };

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
              <CardTitle className="text-lg mb-4">회원 정보</CardTitle>
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
                  >
                    취소
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Check size={16} className="mr-1" />
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
                <Label htmlFor="points">포인트</Label>
                <Input
                  id="points"
                  value={`${userProfile.points.toLocaleString()}P`}
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
              <CardTitle className="text-lg mb-4">구독 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription.isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 py-1">구독 중</Badge>
                    <span className="font-medium">
                      {subscription.plan} 플랜
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">
                        구독 시작일
                      </Label>
                      <p className="font-medium">{subscription.startDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">
                        구독 종료일
                      </Label>
                      <p className="font-medium">{subscription.endDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">
                        월 결제 금액
                      </Label>
                      <p className="font-medium">
                        {subscription.price?.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline">구독 변경</Button>
                    <Button variant="destructive">구독 해지</Button>
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
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
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
