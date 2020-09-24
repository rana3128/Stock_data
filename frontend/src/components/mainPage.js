import React from 'react';
import { Table, Tag, Space } from 'antd';
import { Modal, Button } from 'antd';
import { getAllStock, logIn } from '../apis/apiHandler';
import Etfs from './etfsPage';

export default class MainPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isLogin: props.isLogin,
            modelVisibility: false,
            modelStockSymbole: null,
            keyInput: "",
            allStock: [],
            columns: [
                {
                    title: 'Security Name',
                    dataIndex: 'Security Name',
                    key: 'Security Name',
                    render: text => <div>{text}</div>,
                },
                {
                    title: 'Symbol',
                    dataIndex: 'Symbol',
                    key: 'Symbol',
                    render: text => <div>{text}</div>
                },
                {
                    title: 'ETF',
                    dataIndex: 'ETF',
                    key: 'ETF',
                    render: text => <div>{text}</div>
                },
            ],
        };
    }

    componentDidMount() {
        getAllStock()
            .then(res => {
                if (res && res.length > 0) {
                    this.setState({ allStock: res });
                }
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isLogin !== prevProps.isLogin) {
            this.setState({ isLogin: this.props.isLogin });
        }
    }

    handleRowSelection = (event, record, rowIndex) => {
        this.setState({
            modelVisibility: true,
            modelStockSymbole: record.Symbol || null
        })
    }

    handleModel = (visiblity) => {
        this.setState({ modelVisibility: visiblity });
    }

    handleKeyImput = (event) => {
        const value = event.target.value;
        console.log(value);
        this.setState({keyInput : value});
    }

    logInHanlder = () => {
        logIn(this.state.keyInput);
    }

    isLoginView = () => {
        if (this.state.isLogin) {
            return (<button style={{margin: "20px"}} title="LogOut" onClick={this.logOut}>Log Out</button>)
        } else {
            return (
                <div style={{margin: "50px"}} >
                    <input name="key" onChange={this.handleKeyImput}/>
                    <button title="LogOut" onClick={this.logInHanlder}>LogIn</button>
                </div>
            )
        }
    }

    logOut = async () => {
        await localStorage.removeItem('jwtAccessToken');
        window.location.href = "/";
    }

    tableAndModel = () => {
        return (
            <div style={{ width: "70%", margin: "20px" }}>
                <Table columns={this.state.columns} dataSource={this.state.allStock}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => this.handleRowSelection(event, record, rowIndex), // click row
                        };
                    }}
                />
                <Modal
                    title="Stock Details"
                    visible={this.state.modelVisibility}
                    onOk={() => this.handleModel(false)}
                    onCancel={() => this.handleModel(false)}
                    width={1000}
                >
                    <Etfs symbol={this.state.modelStockSymbole} />
                </Modal>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.isLoginView()}
                { this.state.isLogin ? this.tableAndModel() : null}
            </div>
        );
    }
}
