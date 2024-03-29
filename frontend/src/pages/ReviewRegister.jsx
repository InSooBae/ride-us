import { Box, Grommet, Notification } from "grommet";
import React, { useEffect, useState } from "react";
import { Map, Polyline } from "react-kakao-maps-sdk";
import styled from "styled-components";
import CloseButton from "../assets/images/close.png";
import { StyledText } from "../components/Common";
import Star from "../assets/images/star_review.png";
import StarBlank from "../assets/images/star_review_blank.png";
import { useLocation, useNavigate } from "react-router-dom";
import ImInput from "../assets/icons/imageInput.svg";
import { FlexBox, STextArea } from "../components/UserStyled";
import Button from "../components/Button";
import {
  expectTimeHandle,
  tags as initTags,
  TimeBox,
  TimeBoxSecond,
} from "../utils/util";
import { BootstrapButton, RegisterButton } from "../components/Buttons";
import { AlertDialog } from "../components/AlertDialog";
import { writeReview } from "../utils/api/reviewApi";
import { ReactComponent as Fail } from "../assets/icons/fail.svg";
import Clock from "../assets/icons/clock.svg";
import Flag from "../assets/icons/flag.svg";
import { motion } from "framer-motion";

const HeaderDiv = styled.div`
  margin: 5px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  padding: 5px;
  padding-bottom: 10px;
`;

const BackButton = styled(motion.button)`
  background: none;
  font-size: 12px;
  font-family: Noto Sans KR, sans-serif;
  border: 0px;
  width: 10vw;
`;

export const ImageBtn = styled.img`
  background: #fff;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  &:hover {
    background: rgb(77, 77, 77);
    color: #fff;
  }
`;
//   courseData: {
// courseName: courseName,
//     latlng: mapData.latlng,
//     topSpeed: data.topSpeed,
//     avgSpeed: data.avgSpeed,
//     nowTime: nowTime,
//     totalDistance: data.totalDistance,
//   },

const GrommetTheme = {
  notification: {
    toast: {
      time: 600,
      container: {
        width: "small",
      },
    },
    normal: {
      toast: {
        background: {
          color: "white",
          opacity: "strong",
        },
      },
    },
    critical: {
      toast: {
        background: {
          color: "white",
          opacity: "strong",
        },
      },
      icon: () => <Fail />,
    },
  },
  carousel: {
    animation: {
      duration: 300,
    },
  },
};

const HeaderBox = ({ goBack }) => {
  return (
    <HeaderDiv>
      <div style={{ width: "10vw" }}></div>
      <StyledText
        size="20px"
        weight="bold"
        text="리뷰 쓰기"
        style={{
          alignItems: "center",
        }}
      />
      <BackButton whileTap={{ scale: 1.2 }} onClick={goBack}>
        <img
          src={CloseButton}
          style={{
            alignItems: "center",
            display: "flex",
          }}
        />
      </BackButton>
    </HeaderDiv>
  );
};

export const ReviewRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reviewDesc, setReviewDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState();
  const [select, setSelect] = useState([]);
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const { courseData } = location.state;
  const [open, setOpen] = useState(false);
  const [notValid, setNotValid] = useState(false);
  const [exit, setExit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleStarClick = (index) => {
    let clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
  };
  const array = [0, 1, 2, 3, 4];

  useEffect(() => {
    setTags(initTags);
  }, []);
  const handleImageUpload = (e) => {
    const fileArr = e.target.files;
    // console.log(fileArr[0]);
    setImage(fileArr[0]);
  };

  const handleText = (text) => {
    //  console.log(text);
    const MAX_LENGTH = 50;
    if (text.length <= MAX_LENGTH) setReviewDesc(text);
  };

  const isValied = () => {
    let score = clicked.filter(Boolean).length;
    const request = {
      recordId: courseData.recordId,
      score: score,
      content: reviewDesc,
      tags: select,
    };
    console.log(request);
    if (score === 0 || image === undefined || select.length === 0) return false;
    else return true;
  };

  const handleRegister = () => {
    let score = clicked.filter(Boolean).length;
    const request = {
      recordId: courseData.recordId,
      score: score,
      content: reviewDesc,
      tags: select,
    };
    console.log(request);
    const formData = new FormData();
    formData.append("image", image);
    const blob = new Blob([JSON.stringify(request)], {
      type: "application/json",
    });
    formData.append("reviewRequestDto", blob);
    writeReview(
      formData,
      (response) => {
        console.log(response);
        navigate(`/courseDetail/${courseData.courseId}`);
      },
      (fail) => {
        console.log(fail);
      }
    );
  };
  return (
    <Box>
      {/* 헤더 박스 */}
      <HeaderBox
        goBack={() => {
          setExit(true);
        }}
      />
      {/* 바디 */}
      <Box align="center" margin={{ top: "20px" }} gap="medium">
        {/* 지도, 코스 이름, 데이터 */}
        <Box direction="row" gap="large">
          {/* 카카오맵 */}
          <Map
            center={courseData.latlng[parseInt(courseData.latlng.length / 2)]}
            isPanto={true}
            level={4}
            style={{ borderRadius: "10px", width: "120px", height: "120px" }}
          >
            <Polyline
              path={[courseData.latlng]}
              strokeWeight={3} // 선의 두께 입니다
              strokeColor={"#030ff1"} // 선의 색깔입니다
              strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle={"solid"} // 선의 스타일입니다
            />
          </Map>
          <Box gap="medium" justify="center">
            <StyledText
              text={courseData.courseName}
              size="18px"
              style={{
                fontFamily: "gwtt",
              }}
            />
            <Box
              direction="row"
              gap="medium"
              margin={{
                top: "10px",
                right: "15px",
              }}
            >
              <Box
                direction="row"
                align="center"
                gap="4px"
                style={{
                  backgroundColor: "#F8F38F",
                  borderRadius: "10px",
                  // margin: "3px",
                  padding: "4px 6px",
                }}
              >
                <img src={Clock} width="13px" height="13px" />
                <TimeBoxSecond time={courseData.nowTime} />
              </Box>
              <Box
                direction="row"
                align="center"
                gap="4px"
                style={{
                  backgroundColor: "#BDE0EF",
                  borderRadius: "10px",
                  // margin: "3px",
                  padding: "4px 6px",
                }}
              >
                <img src={Flag} width="13px" height="13px" />
                <Box align="end" direction="row">
                  <StyledText
                    text={courseData.totalDistance}
                    weight="bold"
                    size="17px"
                  />
                  <StyledText size="13px" text={"km"} weight="bold" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* 지도, 코스 이름, 데이터 끝 */}
        {/* 별점 입력 시작 */}
        <Box margin={{ top: "20px" }} gap="medium">
          <StyledText
            text="코스 어떠셨나요?"
            size="22px"
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: "gwtt",
            }}
          />
          <Box direction="row">
            {array.map((el) => (
              <img
                key={el}
                onClick={() => handleStarClick(el)}
                src={clicked[el] ? Star : StarBlank}
              />
            ))}
          </Box>
        </Box>
        {/* 별점 입력 끝 */}
        {/* 사진 첨부 버튼 시작 */}

        {/* 사진 첨부 버튼 끝 */}
        {/* 텍스트아리아 시작 */}
        <Box margin="small" width="90%" align="center">
          <Box width="90%" align="end">
            <label
              htmlFor="image"
              style={{
                display: "flex",
                alignContent: "end",
              }}
            >
              <ImageBtn src={ImInput} />
              <StyledText
                size="13px"
                color={image ? "black" : "lightgray"}
                text={image ? "첨부 완료" : "최대 1장"}
                alignSelf="end"
              />
            </label>
            <input
              id="image"
              type="file"
              accept="image/jpg,image/png,image/jpeg,image/gif"
              style={{
                display: "none",
              }}
              onChange={handleImageUpload}
            />
          </Box>
          <STextArea
            placeholder="코스에 대한 리뷰를 작성해주세요!"
            onChange={(e) => handleText(e.target.value)}
            value={reviewDesc}
          />
          <Box justify="end" direction="row" width="90%">
            <div>{reviewDesc.length} / 50</div>
          </Box>
        </Box>
        {/* 텍스트 아리아 끝 */}
        {/* 태그 시작 */}
        <Box margin={{ top: "20px", left: "15px", bottom: "10px" }}>
          <StyledText text="Tag (최대 5개)" size="14px" weight="bold" />
          <FlexBox Column_C>
            <FlexBox
              Row_S
              style={{
                flexWrap: "wrap",
                padding: "6px 10px",
                width: "88vw",
              }}
            >
              {tags.map((tag, idx) =>
                select.some((v) => v.id === tag.id) ? (
                  <Button
                    key={idx}
                    onClick={() => {
                      setSelect(
                        select.filter((Button) => Button.id !== tag.id)
                      );
                    }}
                    taggreen="true"
                    style={{
                      margin: "6px 3px ",
                      wordWrap: "break-word",
                      minWidth: "22%",
                      padding: "5px 3px",
                    }}
                  >
                    #{tag.searchTagName}
                  </Button>
                ) : (
                  <Button
                    key={idx}
                    onClick={() => {
                      select.length === 5
                        ? setVisible(true)
                        : setSelect((select) => [...select, tag]);
                    }}
                    taggray="true"
                    style={{
                      margin: "6px 3px ",
                      wordWrap: "break-word",
                      minWidth: "22%",
                      padding: "5px 3px",
                    }}
                  >
                    #{tag.searchTagName}
                  </Button>
                )
              )}
            </FlexBox>
          </FlexBox>
        </Box>
        {/* 태그 끝 */}
        <StyledText
          text="별점, 사진, 태그는 필수입니다!"
          style={{
            fontFamily: "gwtt",
          }}
        />
        {/* <Box direction="row" gap="small">
          <StyledText
            text={`별점 : ${clicked.filter(Boolean).length > 0 ? "O" : "X"}`}
          />
          <StyledText text={`사진 : ${image !== undefined ? "O" : "X"}`} />
          <StyledText text={`태그 : ${select.length !== 0 ? "O" : "X"}`} />
        </Box> */}
        {/* 등록 버튼 시작 */}
        <RegisterButton
          onClick={() => {
            if (isValied()) setOpen(true);
            else setNotValid(true);
          }}
          whileTap={{ scale: 1.2 }}
        >
          등록
        </RegisterButton>
        <AlertDialog
          open={open}
          handleClose={() => {
            setOpen(false);
          }}
          handleAction={handleRegister}
          title="리뷰 등록"
          desc="리뷰를 등록하시겠습니까?"
          cancel="취소"
          accept="등록"
          register
        />

        <AlertDialog
          open={notValid}
          handleClose={() => {
            setNotValid(false);
          }}
          title="리뷰 등록"
          desc="모든 정보를 입력하세요!"
          cancel="닫기"
          accept={undefined}
        />
        <AlertDialog
          open={exit}
          handleClose={() => {
            setExit(false);
          }}
          handleAction={() => {
            navigate("/");
          }}
          title="등록 취소"
          desc="리뷰 등록을 취소하시겠습니까?"
          accept="나가기"
          cancel="닫기"
        />
        {visible && (
          <Grommet theme={GrommetTheme}>
            <Notification
              toast={{ position: "center" }}
              title="태그는 5개까지"
              status={"normal"}
              onClose={() => setVisible(false)}
            />
          </Grommet>
        )}
      </Box>
    </Box>
  );
};
