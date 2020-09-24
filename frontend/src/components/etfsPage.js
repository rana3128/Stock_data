import React from 'react';
import { Table, Tag, Space } from 'antd';
import { getEtfs } from '../apis/apiHandler';
import { Chart } from 'react-charts';

export default class Etfs extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selectedSymbol: props.symbol,
            etfsDetails: [],
            columns: [
                {
                    title: 'Date',
                    dataIndex: 'Date',
                    key: 'Date',
                    render: text => <div>{text}</div>,
                },
                {
                    title: 'Open',
                    dataIndex: 'Open',
                    key: 'Open',
                    render: text => <div>{text}</div>
                },
                {
                    title: 'High',
                    dataIndex: 'High',
                    key: 'High',
                    render: text => <div>{text}</div>
                },
                {
                    title: 'Low',
                    dataIndex: 'Low',
                    key: 'Low',
                    render: text => <div>{text}</div>
                },
                {
                    title: 'Close',
                    dataIndex: 'Close',
                    key: 'Close',
                    render: text => <div>{text}</div>
                },
                {
                    title: 'Adj Close',
                    dataIndex: 'Adj Close',
                    key: 'Adj Close',
                    render: text => <div>{text}</div>
                },
                {
                    title: 'Volume',
                    dataIndex: 'Volume',
                    key: 'Volume',
                    render: text => <div>{text}</div>
                },
            ],
        };
    }

    componentDidMount() {
        this.getDetails();
    }

    getDetails = () => {
        getEtfs(this.state.selectedSymbol)
            .then(res => {
                if (res && res.length > 0) {
                    this.setState({ etfsDetails: res });
                }
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.symbol !== prevProps.symbol) {
            this.setState({ selectedSymbol: this.props.symbol }, () => {
                this.getDetails();
            });
        }
    }

    getGraphData = () => {
        const graphData = [];
        this.state.etfsDetails.map(row => {
            const validDate = new Date(row.Date);
            if(validDate != "Invalid Date") {
                console.log(new Date(row.Date));
                graphData.push([new Date(row.Date).getTime(), row.Close]);
            } 
        });
        return graphData;
    }

    render() {
        return (
            <div>
                <div
                    style={{
                        width: '80%',
                        height: '300px'
                    }}
                >
                    <Chart data={[
                        {
                            label: 'Series 1',
                            data: this.getGraphData()
                        }
                    ]}
                        axes={[
                            { primary: true, type: 'linear', position: 'bottom' },
                            { type: 'linear', position: 'left' }
                        ]}
                    />
                </div>

                <Table columns={this.state.columns} dataSource={this.state.etfsDetails} />
            </div>
        );
    }
}
