import { Card } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DetailDelivery from "./DetailDelivery";
import DetailImage from "./DetailImage";
import DetailInfo from "./DetailInfo";
import DetailReview from "./DetailReview";
import Footer from "../home/Footer";
import Detail from "./Detail.css";
import { ArrowUpward, Home, ShoppingCart, Store } from "@material-ui/icons";

function ProductDetail(props) {
  const { p_num } = useParams(); //u_num
  // console.log("p_num:" + p_num);
  const [productdata, setProductdata] = useState({}); //구매 데이터
  const productUrl = localStorage.url + "/product/"; //상품 정보 url
  const [reviewData, setReviewData] = useState(""); //리뷰 데이터
  const [avgReviewCnt, setAvgReviewCnt] = useState(0);

  //상세정보 불러오기
  const productDetail = (p_num) => {
    let url = localStorage.url + "/product/detail?p_num=" + p_num;
    // console.log("url:" + url);
    axios.get(url).then((res) => {
      // console.log("axios detail 성공");
      setProductdata(res.data);
    });
  };

  //리뷰정보 불러오기
  const reviewList = (p_num) => {
    let reviewUrl = localStorage.url + "/product/reviewlist?p_num=" + p_num;
    axios.get(reviewUrl).then((res) =>
      // console.log("axios review 성공");
      setReviewData(res.data)
    );
  };
  // console.log("bb:", reviewData);

  //별점 평균 계산하기
  const [starRate, setStarRate] = useState(0);
  const avgReview = () => {
    if (reviewData === "") {
      return;
    }
    // console.log("aa:", reviewData);
    setAvgReviewCnt(reviewData.list.length);
    let starArr = [];
    for (let i = 0; i < reviewData.list.length; i++) {
      starArr.push(reviewData.list[i].star);
    }

    if (starArr.length === 0) {
      setStarRate(0);
    } else {
      const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
      setStarRate(Math.round(average(starArr) * 10) / 10);
      // console.log("ss:", average(starArr));
    }
  };
  // console.log("detail:" + JSON.stringify(productdata));
  useEffect(() => {
    productDetail(p_num);
    reviewList(p_num);
    avgReview();
  }, []);
  // console.log("review:", reviewData.list.length);

  useEffect(() => {
    avgReview();
  }, [reviewData]);

  //퀵메뉴 이벤트
  const [ScrollY, setScrollY] = useState(0);
  const [BtnStatus, setBtnStatus] = useState(false); // 버튼 상태

  const handleFollow = () => {
    setScrollY(window.pageYOffset);
    if (ScrollY > 100) {
      // 100 이상이면 버튼이 보이게
      setBtnStatus(true);
    } else {
      // 100 이하면 버튼이 사라지게
      setBtnStatus(false);
    }
  };

  const handleTop = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setScrollY(0); // ScrollY 의 값을 초기화
    setBtnStatus(false); // BtnStatus의 값을 false로 바꿈 => 버튼 숨김
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", handleFollow);
    };
    watch();
    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  });

  const navi = useNavigate();

  return (
    <div>
      <div>
        <button
          className={BtnStatus ? "homeBtn active" : "homeBtn"} // 버튼 노출 여부
          onClick={() => navi("/")} // 버튼 클릭시 함수 호출
        >
          <Home fontSize="large" />
        </button>
        <button
          className={BtnStatus ? "shopBtn active" : "shopBtn"} // 버튼 노출 여부
          onClick={() => navi("/product/list")} // 버튼 클릭시 함수 호출
        >
          <Store fontSize="large" />
        </button>
        <button
          className={BtnStatus ? "cartBtn active" : "cartBtn"} // 버튼 노출 여부
          onClick={() => navi("/mypage/cart")} // 버튼 클릭시 함수 호출
        >
          <ShoppingCart fontSize="large" />
        </button>
        <button
          className={BtnStatus ? "topBtn active" : "topBtn"} // 버튼 노출 여부
          onClick={handleTop} // 버튼 클릭시 함수 호출
        >
          <ArrowUpward fontSize="large" />
        </button>
      </div>
      <div
        style={{
          width: "70%",
          margin: "0 auto",
        }}
      >
        <br />
        <h1 style={{ paddingLeft: "40px" }}>
          <Link to={`/product/list?categories=${productdata.category}`}>
            {productdata && productdata.category}
          </Link>
        </h1>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "40%",
              minWidth: "600px",
              textAlign: "center",
              // border: "1px solid black",
              position: "relative",
              // position: "fixed",
              height: "100vh",
            }}
          >
            <Card style={{ cursor: "zoom-in" }}>
              <DetailImage row={productdata} />
            </Card>
          </div>
          <div
            style={{
              width: "40%",
              minWidth: "600px",
              // border: "1px solid red",
              position: "relative",
            }}
          >
            <div>
              <Card>
                <DetailInfo
                  row={productdata}
                  star={starRate}
                  rev={avgReviewCnt}
                />
              </Card>
            </div>
            <br />
            <div>
              <Card>
                <DetailDelivery />
              </Card>
            </div>
          </div>
        </div>

        <br />
        <br />
        <div
          style={{
            width: "100%",
            margin: "0 auto",
            // border: "1px solid blue",
            minHeight: "50vh",
          }}
        >
          <DetailReview row={reviewData} />
        </div>
      </div>
      <br />
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default ProductDetail;
