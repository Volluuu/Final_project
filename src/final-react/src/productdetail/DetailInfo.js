import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { AddTwoTone, Close, RemoveTwoTone } from "@material-ui/icons";
import { Rating } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AddressApi from "../mypage/AddressApi";
import DetailReview from "./DetailReview";

function DetailInfo(props) {
  // DetailDto
  const { row, rev, star, onClickHandle } = props;

  //이동 Hook
  const navi = useNavigate();

  //로그인한 u_num
  const u_num = sessionStorage.u_num;
  // console.log("u_num:" + Number(u_num));

  //amount(수량)
  const [amount, setAmount] = useState(1);

  //수량 증가
  const addamount = () => {
    if (amount < 5) {
      setAmount(Number(amount) + 1);
    } else if (amount > 4) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "최대 5개까지 구매 가능합니다",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    setItemlist({ ...itemlist, amount });
  };
  //수량 감소
  const subamount = () => {
    if (amount > 1) {
      setAmount(Number(amount) - 1);
    } else if (amount < 2) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "최소 1개 이상 구매해야합니다",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    setItemlist({ ...itemlist, amount });
  };

  //데이터를 담을 배열
  const [itemlist, setItemlist] = useState({});
  // console.log("1. itemlist:" + JSON.stringify(itemlist));

  //비교 데이터
  const [cartlist, setCartlist] = useState(""); //cart table 데이터
  const { currentPage } = useParams("");
  //u_num에 해당하는 cart data 불러오기
  const cartdata = () => {
    const cartListUrl = localStorage.url + "/cart/alllist?u_num=" + u_num;

    axios.get(cartListUrl).then((res) => {
      // console.log("cart data 호출 성공");
      setCartlist(res.data);
      // console.dir("data:" + JSON.stringify(cartlist));
    });
  };

  // console.log("cartlist:" + JSON.stringify(cartlist));
  //페이징
  useEffect(() => {
    cartdata();
  }, [currentPage]);

  //데이터 담는 함수
  const additemlist = (e) => {
    setItemlist({
      ...row,
      p_size: e.target.value,
      amount: amount,
    });
    // console.log("addlist:" + JSON.stringify(itemlist));
  };

  //유저정보
  const [u_data, setU_data] = useState("");

  //유저정보 불러오기
  const userdata = () => {
    let userUrl = localStorage.url + "/cart/userdata?u_num=" + u_num;

    axios.get(userUrl).then((res) => {
      // console.log("user 호출 성공");
      setU_data(res.data);
    });
  };

  //결제 정보 입력 dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = (e) => {
    if (u_data === "") {
      alert("로그인 후, 이용가능합니다");
      setOpen(false);
      navi("../../../user/login");
      return;
    }
    setOpen(true);
  };
  // console.log("dd:", u_data === "");

  const handleClose = () => {
    // setAddressData("");
    setOpen(false);
    setPopup(false);
    Swal.fire({
      position: "center",
      icon: "error",
      title: "결제가 취소되었습니다",
      showConfirmButton: false,
      timer: 1500,
    });
    window.location.reload();
  };

  //주소 이벤트
  const [addressData, setAddressData] = useState({
    addr: u_data.address,
  });

  //주소 API 오픈
  const [popup, setPopup] = useState(false);

  const handleInput = (e) => {
    setAddressData({
      ...u_data,
      ...addressData,
      email: e.target.value,
      u_name: e.target.value,
      addr: e.target.value,
      hp: e.target.value,
      t_addrdetail: e.target.value,
    });
  };

  const handleComplete = (data) => {
    setPopup(!popup);
  };

  //ref
  const t_nameref = useRef("");
  const t_hpref = useRef("");
  const t_addrref = useRef("");
  const t_addrdetailref = useRef("");
  const t_emailref = useRef("");

  //결제
  const requestBtn = (e) => {
    // setOpen(false);

    let t_name = t_nameref.current.value;
    let t_hp = t_hpref.current.value;
    let t_addr = t_addrref.current.value;
    let t_addrdetail = t_addrdetailref.current.value;
    let t_email = t_emailref.current.value;

    if (
      t_name === "" ||
      t_hp === "" ||
      t_addr === "" ||
      t_addrdetail === "" ||
      t_email === ""
    ) {
      alert("정보가 누락되었습니다");
      return;
    }

    setOpen(false);

    const IMP = window.IMP; // 생략 가능
    IMP.init("imp81470772"); // 가맹점 식별 코드

    // IMP.request_pay(param, callback) 결제창 호출
    IMP.request_pay(
      {
        // param
        // pg: "html5_inicis.INIpayTest", // PG 모듈
        pg: "kakaopay.TC0ONETIME", // PG 모듈
        pay_method: "kakaopay", // 지불 수단
        merchant_uid: "order_" + new Date().getTime(), //가맹점에서 구별할 수 있는 고유한id
        name: itemlist.p_name,
        // amount: sumPayment, // 가격
        amount: "100",
        // amount: itemlist.price * amount,
        buyer_email: t_emailref.current.value,
        buyer_name: t_nameref.current.value, // 구매자 이름
        buyer_tel: t_nameref.current.value, // 구매자 연락처
        buyer_addr:
          t_addrref.current.value + ", " + t_addrdetailref.current.value, // 구매자 주소지
        // buyer_postcode: "01181", // 구매자 우편번호
        // m_redirect_url: localStorage.url+"/c"
      },
      (rsp) => {
        // callback
        // console.log("rsp:" + JSON.stringify(rsp));
        if (rsp.success) {
          // // 결제 성공 시, 출력 창
          // let msg = "결제가 완료되었습니다.\n";
          // msg += "고유ID : " + rsp.imp_uid + "\n";
          // msg += "상점 거래ID : " + rsp.merchant_uid + "\n";
          // msg += "결제 선택 : " + rsp.pg + "\n";
          // msg += "결제 방식 : " + rsp.pay_method + "\n";
          // msg += "결제 금액 : " + rsp.paid_amount + "\n";
          // // msg += "카드 승인번호 : " + rsp.apply_num + "\n";
          // msg += "상품명 : " + rsp.name + "\n";
          // msg += "구매자 이름 : " + rsp.buyer_name + "\n";
          // msg += "구매자 번호 : " + rsp.buyer_tel + "\n";
          // msg += "구매자 주소 : " + rsp.buyer_addr + "\n";
          // msg += "구매자 이메일 : " + rsp.buyer_email + "\n";

          // alert("결제 성공:" + msg);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "결제가 완료되었습니다",
            showConfirmButton: false,
            timer: 1500,
          });

          let tradeInsertUrl = localStorage.url + "/cart/insertTrade";

          axios
            .post(tradeInsertUrl, {
              u_num,
              p_num: itemlist.p_num,
              merchant_uid: rsp.merchant_uid,
              t_name: rsp.buyer_name,
              t_hp: rsp.buyer_tel,
              t_email: rsp.buyer_email,
              t_addr: rsp.buyer_addr,
              count: itemlist.amount,
              lastprice: itemlist.price * itemlist.amount,
              p_size: itemlist.p_size,
              state: "배송 전",
              withCredentials: true,
              headers: { Authorization: `Bearer ${localStorage.accessToken}` },
            })
            .then((res) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "결제가 완료되었습니다",
                showConfirmButton: false,
                timer: 1500,
              });
              setItemlist("");
              setAmount(1);
              navi("/mypage/all");
            })
            .catch((error) => {
              console.log("실패" + error);
            });
        } else {
          // 결제 실패 시 로직,
          Swal.fire({
            position: "center",
            icon: "error",
            title: "결재를 취소하였습니다.",
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        }
      }
    );
    //--------------------------------------------------------------------
  };

  //구매 불가 이벤트
  const noRequestPay = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "옵션을 선택해주세요.",
      showConfirmButton: false,
      timer: 1000,
    });
  };
  useEffect(() => {
    setItemlist({
      ...row,
      p_size: itemlist.p_size,
      amount: amount,
    });
  }, [amount]);

  useEffect(() => {
    userdata();
  }, []);

  // console.log("addlist2:" + JSON.stringify(itemlist));
  // console.log("amount:" + amount);

  //품목 삭제 이벤트
  const closeEvent = () => {
    setItemlist("");
    document.getElementById("p_size").value = "no";
  };

  //장바구니 이벤트
  const addcart = (e) => {
    if (sessionStorage.loginok === "yes") {
      //중복 비교
      for (let i = 0; i < cartlist.length; i++) {
        //동일한 상품이 존재할 때-----------------------------------------------------------------------------------------
        if (
          itemlist.p_name === cartlist[i].p_name &&
          itemlist.p_size === cartlist[i].p_size
        ) {
          Swal.fire({
            title: "동일한 상품이 존재합니다",
            text: "그래도 추가하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "장바구니 추가",
          }).then((result) => {
            if (result.isConfirmed) {
              // DB insert
              let insertUrl = localStorage.url + "/cart/insert";
              if (itemlist.p_size != null) {
                axios
                  .post(insertUrl, {
                    u_num,
                    p_num: itemlist.p_num,
                    p_size: itemlist.p_size,
                    amount,
                  })
                  .then((res) => {
                    // alert("장바구니 추가");
                    Swal.fire({
                      title: "장바구니에 추가되었습니다",
                      text: "장바구니로 이동하시겠습니까?",
                      icon: "success",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "장바구니로 이동",
                    }).then((result) => {
                      console.log("result:" + JSON.stringify(result));
                      if (result.isConfirmed) {
                        navi("/mypage/cart/1");
                      }
                      if (result.isDismissed) {
                        // setAmount(1);
                        // setItemlist("");
                        closeEvent();

                        // alert("취소");
                      }
                      // alert("취소222");
                      closeEvent();
                    });
                    // navi("/product/list");
                  });
              } else {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "옵션을 선택해주세요.",
                  showConfirmButton: false,
                  timer: 1000,
                });
                return;
              }
            }
            if (result.isDismissed) {
              // setAmount(1);
              // setItemlist({});
              closeEvent();
            }
          });
          // navi("/product/list");
          return;
        }
      }

      let insertUrl = localStorage.url + "/cart/insert";
      if (itemlist.p_size != null) {
        axios
          .post(insertUrl, {
            u_num,
            p_num: itemlist.p_num,
            p_size: itemlist.p_size,
            amount,
          })
          .then((res) => {
            // alert("장바구니 추가");
            Swal.fire({
              title: "장바구니에 추가되었습니다",
              text: "장바구니로 이동하시겠습니까?",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "장바구니로 이동",
            }).then((result) => {
              // console.log("result:" + JSON.stringify(result));
              if (result.isConfirmed) {
                navi("/mypage/cart/1");
              }
              if (result.isDismissed) {
                // setAmount(1);
                // setItemlist({});
                // closeEvent();
                window.location.reload();
              }
            });
            // navi("/product/list");
          });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "옵션을 선택해주세요.",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
    }
    if (sessionStorage.loginok == null) {
      alert("로그인 후, 이용가능합니다");
      navi("../../../user/login");
      return;
    }
  };

  // let insertUrl = localStorage.url + "/cart/insert";

  // if (itemlist.p_size != null) {
  //   axios
  //     .post(insertUrl, {
  //       u_num,
  //       p_num: itemlist.p_num,
  //       p_size: itemlist.p_size,
  //       amount,
  //     })
  //     .then((res) => {
  //       // alert("장바구니 추가");
  //       Swal.fire({
  //         title: "장바구니에 추가되었습니다",
  //         text: "장바구니로 이동하시겠습니까?",
  //         icon: "success",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "장바구니로 이동",
  //       }).then((result) => {
  //         console.log("result:" + JSON.stringify(result));
  //         if (result.isConfirmed) {
  //           navi("/mypage/cart/1");
  //         }
  //         if (result.isDismissed) {
  //           setAmount(1);
  //           setItemlist({});
  //         }
  //       });
  //       // navi("/product/list");
  //     });
  // } else {
  //   alert("사이즈를 선택해주세요");
  //   return;
  // }

  // select 양식 함수
  function selectform() {
    const category = row.category;
    switch (category) {
      case "스몰 레더":
      case "가방":
      case "스카프":
      case "모자":
      case "기타":
      case "벨트":
      case "쥬얼리":
      case "시계":
        return (
          <select
            className="form-select"
            p_num={row.p_num}
            name="p_size"
            style={{ cursor: "pointer" }}
            onChange={additemlist}
            id="p_size"
            defaultValue={"no" || ""}
          >
            <option name="p_size" value="no" disabled>
              선택
            </option>
            <option name="p_size" value="Free">
              Free
            </option>
          </select>
        );
      case "자켓":
      case "후드":
      case "스웨트 셔츠":
      case "반팔 티셔츠":
      case "셔츠":
      case "긴팔 티셔츠":
      case "니트 웨어":
      case "바지":
      case "반바지":
      case "코트":
      case "패딩":
        return (
          <select
            className="form-select sizeselect"
            p_num={row.p_num}
            style={{ cursor: "pointer" }}
            onChange={additemlist}
            name="p_size"
            id="p_size"
            defaultValue={"no" || ""}
          >
            <option name="p_size" value="no" disabled>
              선택
            </option>
            <option name="p_size" value="S">
              S
            </option>
            <option name="p_size" value="M">
              M
            </option>
            <option name="p_size" value="L">
              L
            </option>
            <option name="p_size" value="XL">
              XL
            </option>
          </select>
        );

      case "샌들":
      case "슬리퍼":
      case "스니커즈":
      case "로퍼/플랫":
        return (
          <select
            className="form-select sizeselect"
            p_num={row.p_num}
            style={{
              cursor: "pointer",
            }}
            onChange={additemlist}
            id="p_size"
            defaultValue={"no" || ""}
          >
            <option name="p_size" value="no" disabled>
              선택
            </option>
            <option name="p_size" value="230">
              230mm
            </option>
            <option name="p_size" value="240">
              240mm
            </option>
            <option name="p_size" value="250">
              250mm
            </option>
            <option name="p_size" value="260">
              260mm
            </option>
            <option name="p_size" value="270">
              270mm
            </option>
            <option name="p_size" value="280">
              280mm
            </option>
          </select>
        );
      default:
        return (
          <select
            className="form-select sizeselect"
            style={{ cursor: "pointer" }}
            onChange={additemlist}
            id="p_size"
            defaultValue={"no" || ""}
          >
            <option value="no" disabled>
              선택
            </option>
            <option value="zero" disabled>
              재고 없음
            </option>
          </select>
        );
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>
        <Link to={`/product/list?brands=${row.brand}`}>{row.brand}</Link>
      </h2>
      <br />
      <h5>{row.p_name}</h5>
      <br />
      <div>
        <Rating name="half-rating" value={star} precision={0.1} readOnly />(
        {star}) &nbsp;
        <span style={{ fontSize: "13px" }}>후기(+{rev})</span>
      </div>
      <br />
      <h5 style={{ textAlign: "right" }}>
        {Number(row.price)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        원
      </h5>
      <br />
      <div>
        <span>옵션 선택</span>
        {selectform(row.category)}
      </div>
      <br />

      {itemlist && itemlist.p_size ? (
        <div style={{ border: "1px solid lightgray" }}>
          <Close
            style={{ float: "right", cursor: "pointer" }}
            onClick={closeEvent}
          ></Close>
          <div
            style={{
              backgroundColor: "white",
              // width: "90%",
              margin: "0 auto",
              padding: "20px",
            }}
          >
            <div>
              <p style={{ fontWeight: "bold" }}>{itemlist.p_name}</p>
              <br />
              <div style={{ display: "flex", flexDirection: "row" }}>
                {itemlist &&
                (itemlist.category === "샌들" ||
                  itemlist.category === "슬리퍼" ||
                  itemlist.category === "스니커즈" ||
                  itemlist.category === "로퍼/플랫") ? (
                  <p
                    style={{ width: "45%", fontWeight: "bold", color: "gray" }}
                  >
                    {itemlist.p_size}mm
                  </p>
                ) : (
                  <p
                    style={{ width: "45%", fontWeight: "bold", color: "gray" }}
                  >
                    {itemlist.p_size}
                  </p>
                )}
                <div style={{ width: "30%" }}>
                  <div
                    style={{
                      width: "62%",
                      display: "flex",
                    }}
                  >
                    <RemoveTwoTone
                      value={amount}
                      onClick={subamount}
                      style={{
                        cursor: "pointer",
                        border: "1px solid lightgray",
                      }}
                    />

                    <p
                      style={{
                        width: "50%",
                        textAlign: "center",
                      }}
                    >
                      {amount}
                    </p>

                    <AddTwoTone
                      value={amount}
                      onClick={addamount}
                      style={{
                        cursor: "pointer",
                        border: "1px solid lightgray",
                      }}
                    />
                  </div>
                </div>
                <span>
                  {itemlist.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원
                </span>
              </div>
              <br />
              <h5 style={{ textAlign: "right" }}>
                총 결제 금액 :
                {Number(row.price * amount)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                원
              </h5>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        {itemlist && itemlist.p_size ? (
          <button
            type="button"
            className="btn btn-outline-danger btn-lg purchasebtn"
            onClick={handleClickOpen}
          >
            구매
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg"
            onClick={noRequestPay}
          >
            구매
          </button>
        )}
        &nbsp;&nbsp;
        {itemlist && itemlist.p_size ? (
          <button
            type="button"
            className="btn btn-outline-success btn-lg cartbtn"
            onClick={addcart}
          >
            장바구니
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg"
            onClick={noRequestPay}
          >
            장바구니
          </button>
        )}
        &nbsp;&nbsp;
        <button
          type="button"
          className="btn btn-outline-info btn-lg"
          onClick={() => navi("/product/list")}
        >
          상점으로
        </button>
      </div>
      <br />
      {itemlist && (
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
              결제 정보 입력
            </DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="t_name"
                  name="t_name"
                  label="배송받을 이름"
                  inputRef={t_nameref}
                  error={t_nameref.current.value === "" ? true : false}
                  type="text"
                  fullWidth
                  defaultValue={u_data.u_name}
                />
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="t_hp"
                  name="t_hp"
                  inputRef={t_hpref}
                  error={t_hpref.current.value == "" ? true : false}
                  label="배송받을 연락처"
                  type="text"
                  fullWidth
                  defaultValue={u_data.hp}
                  onChange={handleInput}
                  inputProps={{ maxLength: 13 }}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
                  }}
                />
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="t_addr"
                  name="t_addr"
                  inputRef={t_addrref}
                  error={t_addrref.current.value === "" ? true : false}
                  label="배송받을 주소"
                  type="text"
                  style={{ width: "80%" }}
                  defaultValue={
                    u_data && u_data.addr.split(",")[0].substring(0)
                  }
                  onChange={handleInput}
                  value={addressData.address}
                />
                <Button
                  variant="contained"
                  style={{ width: "110px", marginTop: "10px" }}
                  onClick={handleComplete}
                >
                  주소찾기
                </Button>
                {popup && (
                  <AddressApi
                    postData={addressData}
                    setPostData={setAddressData}
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      position: "fixed",
                      left: "0",
                      top: "0",
                      height: "100%",
                      width: "100%",
                      zIndex: "999",
                    }}
                  ></AddressApi>
                )}
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="t_addrdetail"
                  name="t_addrdetail"
                  inputRef={t_addrdetailref}
                  error={t_addrdetailref.current.value === "" ? true : false}
                  label="상세 주소"
                  type="text"
                  fullWidth
                  defaultValue={
                    u_data && u_data.addr.split(",")[1].substring(1)
                  }
                />

                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="t_email"
                  name="t_email"
                  inputRef={t_emailref}
                  error={t_emailref.current.value === "" ? true : false}
                  label="구매자 email"
                  type="email"
                  fullWidth
                  defaultValue={u_data.email}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={requestBtn} color="primary">
                결제하기
              </Button>
              <Button variant="outlined" onClick={handleClose} color="default">
                취소
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default DetailInfo;
