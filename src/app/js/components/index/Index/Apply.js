import React, { Component } from 'react';
import { Link } from 'react-router';

import SearchBar from  '../../common/SearchBar';
import CommonTable from '../../common/CommonTable';
import Loading from '../../common/Loading';
import NotFound from '../../common/NotFound';

export default class Apply extends Component{
    constructor(props) {
        super(props);
        this.state={
            data: this.props.user.applyList.data,
        }
    }

    componentDidMount() {
        this.props.userBoundAc.getApplyList();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user.applyList.data) {
            this.setState({
                data: nextProps.user.applyList.data,
            })
        }
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    handleApply(id) {
        this.props.userBoundAc.applyAction({id: id, status: '已处理'});
    }

    ignoreApply(id) {
        this.props.userBoundAc.applyAction({id: id, status: '未处理'});
    }

    getSearchList(value) {
        console.log(value);
    }

    render(){
        var data = {
            config: [
                {key: 'applyItem', width: '2', dictKey: '申请项目'},
                {key: 'applyName', width: '2', dictKey: '申请人称呼'},
                {key: 'applyPhone', width: '2', dictKey: '申请人手机号码'},
                {key: 'applyStatus', width: '2', dictKey: '处理状态'},
                {key: 'operate', width: '2', dictKey: '操作', handle: this.operate},
            ],
            item: this.state.data,
        };
        const operateConfig = [
            {action: '改为已处理', handle: this.handleApply},
            {action: '改为未处理', handle: this.ignoreApply},
        ];
        return(
            <div className="apply-wrap">
                <div className="apply">
                    <SearchBar placeholder="请输入" search={this.getSearchList.bind(this)} />
                    {this.state.data == undefined ?
                        <Loading />
                    :
                    this.state.data.length == 0 ?
                        <NotFound />
                    :
                        <CommonTable {...this.props} data={data} operate={operateConfig} />
                    }
                </div>
            </div>
        )
    }
}
var DATA = [
    { "_id" :"57207cccf7bc8f992859a499", "applyItem" : "免费设计", "applyName" : "lihua", "applyPhone" : "18983359954", applyStatus: '未处理'},
    { "_id" :"57207cdcf7bc8f992859a49a", "applyItem" : "免费设计", "applyName" : "lihua", "applyPhone" : "18983359954", applyStatus: '未处理'},
    { "_id" :"57207d1fc4820d222b71fd43", "applyItem" : "免费设计", "applyName" : "lichanghua", "applyPhone" : "18983359954", applyStatus: '未处理'},
];