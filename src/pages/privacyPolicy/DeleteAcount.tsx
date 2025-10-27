// < !DOCTYPE html >
//     <html lang="en">
//         <head>
//             <meta charset="UTF-8" />
//             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//             <title>Account Deletion</title>
//             <style>
//                 body {
//                     margin: 0;
//                 font-family: "Segoe UI", sans-serif;
//                 background: linear-gradient(135deg, #eef2f7, #f8fbff);
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 height: 100vh;
//     }

//                 .container {
//                     background: white;
//                 border-radius: 16px;
//                 box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
//                 width: 420px;
//                 overflow: hidden;
//                 text-align: center;
//     }

//                 .header {
//                     background: #e63946;
//                 color: white;
//                 padding: 30px 20px;
//     }

//                 .header i {
//                     font - size: 40px;
//                 display: block;
//                 margin-bottom: 10px;
//     }

//                 .header h1 {
//                     margin: 0;
//                 font-size: 24px;
//     }

//                 .header p {
//                     margin - top: 5px;
//                 opacity: 0.9;
//     }

//                 .content {
//                     padding: 25px;
//     }

//                 .warning {
//                     background: #fff5e6;
//                 border: 1px solid #ffe4b3;
//                 border-radius: 10px;
//                 padding: 15px;
//                 text-align: left;
//                 margin-bottom: 20px;
//     }

//                 .warning h3 {
//                     color: #d17b00;
//                 margin: 0 0 8px;
//                 font-size: 16px;
//     }

//                 .warning ul {
//                     padding - left: 20px;
//                 margin: 0;
//     }

//                 .input-group {
//                     text - align: left;
//                 margin-bottom: 15px;
//     }

//                 input[type="text"] {
//                     width: 100%;
//                 padding: 10px;
//                 border: 1px solid #ccc;
//                 border-radius: 8px;
//                 outline: none;
//                 transition: border 0.2s;
//     }

//                 input[type="text"]:focus {
//                     border - color: #e63946;
//     }

//                 .checkbox {
//                     text - align: left;
//                 background: #f9fafb;
//                 border: 1px solid #ddd;
//                 padding: 12px;
//                 border-radius: 8px;
//                 font-size: 14px;
//                 margin-bottom: 20px;
//     }

//                 .checkbox input {
//                     margin - right: 8px;
//     }

//                 button {
//                     width: 100%;
//                 background: #e63946;
//                 color: white;
//                 padding: 12px;
//                 border: none;
//                 border-radius: 8px;
//                 font-size: 16px;
//                 cursor: not-allowed;
//                 opacity: 0.6;
//                 transition: opacity 0.3s, cursor 0.3s;
//     }

//                 button.enabled {
//                     cursor: pointer;
//                 opacity: 1;
//     }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <i>🗑️</i>
//                     <h1>Account Deletion</h1>
//                     <p>We're sorry to see you go</p>
//                 </div>

//                 <div class="content">
//                     <div class="warning">
//                         <h3>⚠️ Before you proceed</h3>
//                         <ul>
//                             <li>Account deletion is permanent and cannot be undone.</li>
//                             <li>Download any data you wish to keep before proceeding.</li>
//                             <li>Cancel any active subscriptions before deletion.</li>
//                         </ul>
//                     </div>

//                     <div class="input-group">
//                         <label>📞 Phone Number Verification</label>
//                         <input type="text" id="phone" placeholder="Enter your registered phone number" />
//                         <small>We'll send a verification code to this number</small>
//                     </div>

//                     <div class="checkbox">
//                         <input type="checkbox" id="confirm" />
//                         <label for="confirm">I understand that this action cannot be undone.</label>
//                     </div>

//                     <button id="deleteBtn" disabled>🗑️ Delete My Account</button>
//                 </div>
//             </div>

//             <script>
//                 const checkbox = document.getElementById("confirm");
//                 const deleteBtn = document.getElementById("deleteBtn");

//     checkbox.addEventListener("change", () => {
//       if (checkbox.checked) {
//                     deleteBtn.classList.add("enabled");
//                 deleteBtn.disabled = false;
//       } else {
//                     deleteBtn.classList.remove("enabled");
//                 deleteBtn.disabled = true;
//       }
//     });
//             </script>
//         </body>
//     </html>


import React, { useState } from 'react';

const AccountDeletion: React.FC = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsConfirmed(e.target.checked);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    return (
        <div
            style={{
                margin: 0,
                fontFamily: '"Segoe UI", sans-serif',
                background: 'linear-gradient(135deg, #eef2f7, #f8fbff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    width: '420px',
                    overflow: 'hidden',
                    textAlign: 'center' as const,
                }}
            >
                <div
                    style={{
                        background: '#e63946',
                        color: 'white',
                        padding: '30px 20px',
                    }}
                >
                    <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🗑️</span>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>Account Deletion</h1>
                    <p style={{ marginTop: '5px', opacity: 0.9 }}>We're sorry to see you go</p>
                </div>

                <div style={{ padding: '25px' }}>
                    <div
                        style={{
                            background: '#fff5e6',
                            border: '1px solid #ffe4b3',
                            borderRadius: '10px',
                            padding: '15px',
                            textAlign: 'left' as const,
                            marginBottom: '20px',
                        }}
                    >
                        <h3 style={{ color: '#d17b00', margin: '0 0 8px', fontSize: '16px' }}>
                            ⚠️ Before you proceed
                        </h3>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li>Account deletion is permanent and cannot be undone.</li>
                            <li>Download any data you wish to keep before proceeding.</li>
                            <li>Cancel any active subscriptions before deletion.</li>
                        </ul>
                    </div>

                    <div style={{ textAlign: 'left' as const, marginBottom: '15px' }}>
                        <label>📞 Phone Number Verification</label>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Enter your registered phone number"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border 0.2s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#e63946')}
                            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                        />
                        <small>We'll send a verification code to this number</small>
                    </div>

                    <div
                        style={{
                            textAlign: 'left' as const,
                            background: '#f9fafb',
                            border: '1px solid #ddd',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            marginBottom: '20px',
                        }}
                    >
                        <input
                            type="checkbox"
                            id="confirm"
                            checked={isConfirmed}
                            onChange={handleCheckboxChange}
                            style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="confirm">I understand that this action cannot be undone.</label>
                    </div>

                    <button
                        id="deleteBtn"
                        disabled={!isConfirmed}
                        style={{
                            width: '100%',
                            background: '#e63946',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: isConfirmed ? 'pointer' : 'not-allowed',
                            opacity: isConfirmed ? 1 : 0.6,
                            transition: 'opacity 0.3s, cursor 0.3s',
                        }}
                    >
                        🗑️ Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountDeletion;