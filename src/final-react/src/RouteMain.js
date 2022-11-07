import React from "react";
import Menu from "./home/menu";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import LoginForm from "./user/LoginForm";
import SignupForm from "./user/SignupForm";
import ProductList from "./productlist/ProductList";
import ProductDetail from "./productdetail/ProductDetail";
import AdminForm from "./admin/AdminForm";
import MypageRoute from "./mypage/MypageRoute";

function RouteMain(props) {
  return (
    <div style={{ marginLeft: "100px", marginTop: "50px" }}>
      <Menu />
      <br style={{ clear: "both" }} />
      <br />
      <Routes>
        {/* 홈 */}
        <Route path={"/"} element={<Home />} />
        {/* 로그인 및 회원가입 */}
        <Route path={"/user"}>
          <Route path={"login"} element={<LoginForm />} />
          <Route path={"signup"} element={<SignupForm />} />
        </Route>
        {/* 상품 관련 (리스트, 상세페이지)*/}
        <Route path={"/product"}>
          <Route path={"list/:currentPage"} element={<ProductList />} />
          <Route path={"detail/:p_num"} element={<ProductDetail />} />
        </Route>
        {/* 관리자 페이지 */}
        <Route path={"/admin"} element={<AdminForm />} />
        {/* 마이 페이지 이중 라우터 */}
        <Route path={"/mypage/*"}>
          <Route path={":path"} element={<MypageRoute />} />
        </Route>
        {/* 잘못된 주소*/}
        <Route
          path={"*"}
          element={
            <div>
              <img alt={""} src={"404.png"} style={{ width: "800px" }} />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default RouteMain;