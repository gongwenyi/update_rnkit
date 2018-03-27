import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Icon, Input, Radio, Button, message, Modal } from 'antd';
import appStyle from 'style/Applications.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Applications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0, // app列表页码
      appList: [], // APP列表数据
      totalPages: 1, // APP列表分页数
      numsPerPage: 10, // 每页的条数
      count: 0, // 总条目数
      visible: false, // 创建App对话框
    };
  }
  componentDidMount() {
    $('.appContent').scrollTop(0);
    this.getAppList();
  }
  getAppList(addOne) {
    const self = this;
    self.props.dispatch(actions.check({ url: 'app/list', dataName: 'getAppList', params: { page: self.state.currentPage + 1 }, callback(res) {
      if (self.applications) { // 组件销毁时不进行数据更新操作
        if (res && res.errno === 0) {
          const addItems = addOne ? (res.data.data ? [res.data.data[res.data.data.length - 1]] : []) : (res.data.data || []);
          self.setState(preState => ({
            currentPage: res.data.currentPage,
            numsPerPage: res.data.numsPerPage,
            count: res.data.count,
            appList: [...preState.appList, ...addItems],
            totalPages: res.data.totalPages,
          }));
        } else {
          message.error(res ? res.errmsg : '接口异常，请稍后重试！');
        }
      }
    } }));
  }
  enterApp(key) {
    console.log(key);
    this.props.history.push(`/applications/${key}/patch`);
  }
  newApp() {
    this.props.form.resetFields();
    this.setState(preState => ({ visible: true }));
  }
  handleOk() {
    const self = this;
    self.props.form.validateFields((errors, values) => {
      if (!errors) {
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'app/create', tip: '创建APP', params: values, callback(res) {
          if (res && res.errno === 0 && self.applications) {
            self.setState(preState => ({ visible: false }));
            if (self.state.appList.length === self.state.count) { // 创建成功后如果是最后一页则更新页面数据
              if (self.state.count % self.state.numsPerPage === 0 && self.state.count !== 0) {
                self.getAppList(true);
              } else {
                self.setState(preState => ({ currentPage: preState.currentPage - 1 }));
                self.getAppList(true);
              }
            }
          }
        } }));
      }
    });
  }
  handleCancel() {
    this.setState(preState => ({ visible: false }));
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    document.title = '我的应用 - React Native热更新-RNKit云服务';
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className="applications" class={ appStyle.applications } ref={(applications) => { this.applications = applications; }}>
        { this.state.appList.map((item, index) => (
          <Card key={index} className="card">
            { item.icon ? <img className="logo" src={ item.icon } alt="app-logo" />
            : <img className="logo" src={require('../assets/img/applogo-default.png')} alt="app-logo" /> }
            { item.platform === 1 ? <p className="platform"><Icon type="apple" />iOS</p>
            : item.platform === 2 ? <p className="platform"><Icon type="android" />Android</p> : null }
            <h3 className="app-name">{item.name}</h3>
            <p className="app-version">App最新版本：{item.app_version || ''}</p>
            <p className="app-identifier" title={item.app_identifier}>应用包名：{item.app_identifier}</p>
            <Button size="small" className="button" onClick={this.enterApp.bind(this, item.key)}>
              管理
            </Button>
        </Card>)) }
        <Card className="card">
          <p className="icon-add">
            <img src={require('../assets/img/add.png')} alt="add-logo" style={{ width: '80px' }} />
          </p>
          <Button size="small" className="button" onClick={this.newApp.bind(this)}>
            创建App
          </Button>
        </Card>
        { (this.state.totalPages > this.state.currentPage) && <div className="loadmore-btn-box">
          <Button loading={this.props.getAppListIsLoading} onClick={this.getAppList.bind(this, false)}>加载更多</Button>
        </div> }
        <Modal
          title="创建App"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}>
          <Form className="login-form">
            <FormItem label="应用平台" {...formItemLayout}>
              { getFieldDecorator('platform', { initialValue: 1 })(
                <RadioGroup>
                  <Radio value={1}>ios</Radio>
                  <Radio value={2}>android</Radio>
                </RadioGroup>) }
            </FormItem>
            <FormItem label="应用名称" {...formItemLayout}>
              { getFieldDecorator('name', { rules: [{ required: true, message: '请输入应用名称' }, { min: 1, max: 40, message: '长度在 1 到 40 个字符' }] })(<Input placeholder="请输入应用名称" />) }
            </FormItem>
            <FormItem label="应用包名" {...formItemLayout}>
              { getFieldDecorator('app_identifier', { rules: [{ required: true, message: '请输入应用包名' }] })(<Input placeholder="请输入应用包名" />) }
            </FormItem>
            <FormItem label="下载地址" {...formItemLayout}>
              { getFieldDecorator('download_url', { rules: [{ required: false, message: '请输入下载地址' }, { min: 4, max: 200, message: '长度在 4 到 200 个字符' }] })(<Input placeholder="请输入下载地址" />) }
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getAppListIsLoading: state.getAppListIsLoading,
  };
};

export default connect(mapStateToProps)(Form.create()(Applications));
