import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import MypageOrderList from "./MypageOrderList";
import {Close} from "@mui/icons-material";


function MypageForm(props) {
    const {currentPage} = useParams(); // currentPage 값 받아오기
    const [u_num, setU_num] = useState(sessionStorage.u_num); // 세션의 u_num으로 초기값 설정
    const [u_name, setU_name] = useState(sessionStorage.u_name); // 세션의 u_name으로 초기값 설정
    const [userDto, setUserDto] = useState(''); // 세션의 u_num으로 받아온 유저 데이터
    const [tradeData, setTradeData] = useState({}); // 페이징 처리할 모든 데이터 담기
    const [pointStyle, setPointStyle] = useState('none'); // 모달 창 State
    const [rowBackground, setRowBackGround]=useState('');

    const productUrl=process.env.REACT_APP_URL+"/product/";
    // 세션의 u_name으로 받아오는 유저 정보
    const userByName = () => {
        let userByNameUrl = process.env.REACT_APP_URL + "/mypage/userbyname?u_name=" + u_name;
        axios.get(userByNameUrl)
            .then(res => {
                setUserDto(res.data);
            })
    }

    // 세션의 u_num으로 받아오는 유저 정보
    const userByNum = () => {
        let userByNumUrl = process.env.REACT_APP_URL + "/mypage/userbynum?u_num=" + u_num;
        let orderListUrl = process.env.REACT_APP_URL + "/mypage/orderlist?u_num=" + u_num + "&currentPage=" + (currentPage === undefined ? 1 : currentPage);
        axios.get(userByNumUrl)
            .then(res => {
                setUserDto(res.data);
            })
        axios.get(orderListUrl)
            .then(res => {
                setTradeData(res.data);
            })
    }

    useEffect(() => {
        userByNum();
    }, [])

    return (

        <div data-v-f263fda4="" data-v-39b2348a="" className="content_area">
            {
                userDto &&
                <div data-v-f263fda4="" className="my_home">
                    <div data-v-5acef129="" data-v-f263fda4="" className="user_membership">
                        <div data-v-5acef129="" className="user_detail">
                            <div data-v-5acef129="" className="user_thumb"><img data-v-5acef129=""
                                                                                src="/_nuxt/img/blank_profile.4347742.png"
                                                                                alt="사용자 이미지"
                                                                                className="thumb_img"/>
                            </div>


                            <div data-v-5acef129="" className="user_info">
                                <div data-v-5acef129="" className="info_box"><strong data-v-5acef129=""
                                                                                     className="name">{`${userDto.u_name} ${userDto.isadmin==="ADMIN"?"관리자":"고객님 정보"}`}</strong>
                                    <p data-v-5acef129="" className="email">{userDto.email.charAt(0) +
                                        "*".repeat((userDto.email.split("@")[0].length) - 2) +
                                        userDto.email.charAt(userDto.email.indexOf("@") - 1) +
                                        "@" +
                                        userDto.email.split("@")[1]}</p><Link
                                        data-v-3d1bcc82="" data-v-5acef129="" to="/mypage/profile"
                                        className="btn btn outlinegrey small" type="button"> 프로필 수정 </Link>
                                </div>
                            </div>
                        </div>
                        <div data-v-5acef129="" className="membership_detail">
                            <a data-v-5acef129="" href="#"
                               className="membership_item disabled"><strong
                                data-v-5acef129=""
                                className="info" style={{color:userDto.isadmin==="ADMIN"?"red":""}}> {userDto.isadmin === "ADMIN" ? "관리자" : "일반 회원"} </strong><p
                                data-v-5acef129=""
                                className="title"> {userDto.gaip.substring(0, 10)} 가입 </p>
                            </a>
                            <Link data-v-5acef129="" to="#" className="membership_item"
                               onClick={() => {
                                   setPointStyle("")
                               }
                               }><strong
                                data-v-5acef129="" className="info"> 0P </strong><p data-v-5acef129=""
                                                                                    className="title"> 적립금 </p>
                            </Link>
                        </div>
                    </div>
                    <div data-v-f263fda4="" className="inventory_box">
                        <div data-v-77bfdc51="" data-v-f263fda4="">
                            <div data-v-6752ceb2="" data-v-77bfdc51="" className="my_home_title"><h3
                                data-v-6752ceb2=""
                                className="title"> 주문 내역 </h3><Link data-v-6752ceb2="" to="/mypage/order"
                                                                 className="btn_more"><span
                                data-v-6752ceb2="" className="btn_txt">더보기</span>
                            </Link></div>
                            <div data-v-77bfdc51="" className="purchase_list_tab inventory">
                                <div data-v-77bfdc51="" className="tab_item total"><a data-v-77bfdc51=""
                                                                                      href="/mypage/order"
                                                                                      className="tab_link">
                                    <dl data-v-77bfdc51="" className="tab_box">
                                        <dt data-v-77bfdc51="" className="title">전체</dt>
                                        <dd data-v-77bfdc51="" className="count">{tradeData.totalCount}</dd>
                                    </dl>
                                </a></div>
                                <div data-v-77bfdc51="" className="tab_item"><a data-v-77bfdc51="" href="#"
                                                                                className="tab_link">
                                    <dl data-v-77bfdc51="" className="tab_box">
                                        <dt data-v-77bfdc51="" className="title">배송 전</dt>
                                        <dd data-v-77bfdc51="" className="count" style={{color:"#FF0000"}}>{tradeData.stateCount && tradeData.stateCount[0]}</dd>
                                    </dl>
                                </a></div>
                                <div data-v-77bfdc51="" className="tab_item"><a data-v-77bfdc51="" href="#"
                                                                                className="tab_link">
                                    <dl data-v-77bfdc51="" className="tab_box">
                                        <dt data-v-77bfdc51="" className="title">배송 중</dt>
                                        <dd data-v-77bfdc51="" className="count" style={{color:"#0000FF"}}>{tradeData.stateCount && tradeData.stateCount[1]}</dd>
                                    </dl>
                                </a></div>
                                <div data-v-77bfdc51="" className="tab_item"><a data-v-77bfdc51="" href="#"
                                                                                className="tab_link">
                                    <dl data-v-77bfdc51="" className="tab_box">
                                        <dt data-v-77bfdc51="" className="title">배송 완료</dt>
                                        <dd data-v-77bfdc51="" className="count" style={{color:"#A020F0"}}>{tradeData.stateCount && tradeData.stateCount[2]}</dd>
                                    </dl>
                                </a></div>
                            </div>

                            {
                                tradeData.mapsize === 0 ?
                                    <div data-v-f263fda4="">
                                        <div data-v-50c8b1d2="" data-v-f263fda4="" className="purchase_list all bid">
                                            <div data-v-541a17ff="" data-v-50c8b1d2="" className="empty_area"><p
                                                data-v-541a17ff=""
                                                className="desc">주문
                                                내역이 없습니다.</p></div>
                                        </div>
                                    </div>
                                    :
                                    <div data-v-f263fda4="">
                                        <div data-v-50c8b1d2="" data-v-f263fda4="" className="purchase_list all bid">
                                            <div style={{display:"grid",gridTemplateRows:"repeat(10, 1fr)",gridTemplateColumns:"1fr 3fr 1fr 1fr",textAlign:"center"}}>
                                                <div style={{gridColumn:"1/5", gridRow:"1/2"}}><hr/></div>
                                                <b style={{paddingTop:"6px"}}>주문일자</b>
                                                <b style={{paddingTop:"6px"}}>상품명</b>
                                                <b style={{paddingTop:"6px",textAlign:"right"}}>총 결제 금액</b>
                                                <b style={{paddingTop:"6px"}}>배송상태</b>
                                                <div style={{gridColumn: "1/5", gridRow: "3/4"}}><hr/></div>
                                                {
                                                    tradeData.joined &&
                                                    tradeData.joined.slice(0,5).map((jitem,idx)=>(
                                                        <React.Fragment key={idx}>
                                                            <span style={{fontWeight:"inherit"}}>{jitem.day}</span>
                                                            <span style={{color:jitem.state==="배송 전"?"#FF0000":jitem.state==="배송 중"?"#0000FF":"#A020F0",textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                                <Link to={`/product/detail/${jitem.p_num}`}>
                                                                <img alt={""} src={productUrl+jitem.photo} style={{maxWidth:"33px"}}/>&nbsp;
                                                                    {jitem.p_name}
                                                                </Link>
                                                            </span>
                                                            <span style={{textAlign:"right"}}>{(jitem.lastprice*jitem.count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                                                            <span style={{color:jitem.state==="배송 전"?"#FF0000":jitem.state==="배송 중"?"#0000FF":"#A020F0"}}>{jitem.state}</span>
                                                        </React.Fragment>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>

                            }
                        </div>
                    </div>
                    <div data-v-6752ceb2="" data-v-f263fda4="" className="my_home_title"><h3 data-v-6752ceb2=""
                                                                                             className="title"> 장바구니 </h3>
                        <a data-v-6752ceb2="" href="/mypage/basket" className="btn_more"><span
                            data-v-6752ceb2=""
                            className="btn_txt">더보기</span>
                        </a>
                    </div>
                    <div data-v-f263fda4="" className="recent_purchase">
                        <div data-v-0c307fea="" data-v-f263fda4="" className="purchase_list_tab">
                            <div data-v-0c307fea="" className="tab_item total"><a data-v-0c307fea="" href="#"
                                                                                  className="tab_link">
                                <dl data-v-0c307fea="" className="tab_box">
                                    <dt data-v-0c307fea="" className="title">전체</dt>
                                    <dd data-v-0c307fea="" className="count">0</dd>
                                </dl>
                            </a></div>
                            <div data-v-0c307fea="" className="tab_item tab_on"><a data-v-0c307fea="" href="#"
                                                                                   className="tab_link">
                                <dl data-v-0c307fea="" className="tab_box">
                                    <dt data-v-0c307fea="" className="title">입찰 중</dt>
                                    <dd data-v-0c307fea="" className="count">0</dd>
                                </dl>
                            </a></div>
                            <div data-v-0c307fea="" className="tab_item"><a data-v-0c307fea="" href="#"
                                                                            className="tab_link">
                                <dl data-v-0c307fea="" className="tab_box">
                                    <dt data-v-0c307fea="" className="title">진행 중</dt>
                                    <dd data-v-0c307fea="" className="count">0</dd>
                                </dl>
                            </a></div>
                            <div data-v-0c307fea="" className="tab_item"><a data-v-0c307fea="" href="#"
                                                                            className="tab_link">
                                <dl data-v-0c307fea="" className="tab_box">
                                    <dt data-v-0c307fea="" className="title">종료</dt>
                                    <dd data-v-0c307fea="" className="count">0</dd>
                                </dl>
                            </a></div>
                        </div>
                        <div data-v-50c8b1d2="" data-v-f263fda4="" className="purchase_list all ask">
                            <div data-v-541a17ff="" data-v-50c8b1d2="" className="empty_area"><p
                                data-v-541a17ff=""
                                className="desc"> 장바구니가 비어 있습니다.</p></div>
                        </div>
                    </div>


                    <div data-v-1f7c6d3f="" data-v-28cabbb5="" data-v-f263fda4="" className="layer_point layer lg"
                         style={{display: pointStyle}}>
                        <div data-v-1f7c6d3f="" className="layer_container">
                            <div data-v-1f7c6d3f="" className="layer_header"><h2 data-v-28cabbb5=""
                                                                                 data-v-1f7c6d3f=""
                                                                                 className="title">적립금 이용안내</h2>
                            </div>
                            <div data-v-1f7c6d3f="" className="layer_content">
                                <div data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_wrap">
                                    <div data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_point"><h3
                                        data-v-28cabbb5="" data-v-1f7c6d3f="" className="title">사용 가능한 포인트</h3><p
                                        data-v-28cabbb5="" data-v-1f7c6d3f="" className="point_box"><span
                                        data-v-28cabbb5="" data-v-1f7c6d3f="" className="point">0</span><span
                                        data-v-28cabbb5="" data-v-1f7c6d3f="" className="unit">P</span></p>
                                        <div data-v-28cabbb5="" data-v-1f7c6d3f="" className="point_info">
                                            <p data-v-28cabbb5="" data-v-1f7c6d3f=""
                                               className="info_item"> 포인트
                                                유효기간은 운영 정책에 따라 달라질 수 있습니다. </p></div>
                                    </div>
                                    <ul data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_list">

                                        <li data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_item"> 환불, 취소
                                            시 사용한 포인트는 환불되지 않습니다.
                                        </li>
                                        <li data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_item">
                                            사용하지 않으실 경우 유효기간이 지나면 자동 소멸됩니다.
                                        </li>
                                        <li data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_item"> 유효기간이 지난
                                            후
                                            환불받은 포인트는 다시 사용하실 수 없습니다.
                                        </li>
                                        <li data-v-28cabbb5="" data-v-1f7c6d3f="" className="usable_item"> 회원탈퇴
                                            시
                                            모든 포인트는 사라집니다.

                                        </li>
                                    </ul>
                                </div>
                                <div data-v-28cabbb5="" data-v-1f7c6d3f="" className="layer_btn"><a
                                    data-v-3d1bcc82=""
                                    data-v-28cabbb5=""
                                    href="#"
                                    className="btn outline medium"
                                    data-v-1f7c6d3f=""
                                    onClick={() => setPointStyle("none")}> 확인 </a>
                                </div>
                            </div>
                            <a data-v-28cabbb5="" data-v-1f7c6d3f="" href="#" className="btn_layer_close"
                               onClick={() => setPointStyle("none")}>
                                <Close/>
                            </a></div>
                    </div>
                </div>
            }


        </div>

    );
}

export default MypageForm;