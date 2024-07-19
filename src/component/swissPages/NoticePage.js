import React from "react";
import "./MainStyle.css"

const NoticePage = () => {
    return (
        <div className="Notice">
            <div className="Update">
                <h3>2024.04.04 v1.0.0 App Launch: </h3>
                <ul>
                    <li>플레이어 기능 런칭: 추가, 기권, 재참가, 순위 등</li>
                    <li>라운드 기능 런칭: 매칭, 추가, 전적수정 등</li>
                </ul>
            </div>
            <div className="Update">
                <h3>2024.04.08 v1.0.1 Update: </h3>
                <ul>
                    <li>대진표 프린트 기능 추가</li>
                    <li>공지사항 탭 추가</li>
                </ul>
            </div>
            <span>Made by KAIST Khartes Development Team, Jinhyeok Yang</span>
        </div>
    )
}

export default NoticePage;