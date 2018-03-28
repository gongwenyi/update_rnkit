import React from 'react';
import { connect } from 'react-redux';
import { Button, message, Menu, Dropdown, Icon, Tag, Modal, Form, Input, Radio, Switch, Upload, Slider, InputNumber, Select, DatePicker } from 'antd';
import appStyle from 'style/Patch.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;

class Patch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packageListInfo: { // 应用包列表信息
        currentPage: 0, // 列表页码
        data: [], // 列表数据
        totalPages: 1, // 列表分页数
        numsPerPage: 10, // 每页的条数
        count: 0, // 总条目数
      },
      packageVisiable: false, // package显示切换
      packageEditType: 'new', // 保存类型
      currentPackage: {}, // 当前编辑的的package
      versionListInfo: { // 补丁包列表信息
        currentPage: 0, // 列表页码
        data: [], // 列表数据
        totalPages: 1, // 列表分页数
        numsPerPage: 10, // 每页的条数
        count: 0, // 总条目数
      },
      versionVisiable: false, // 补丁包显示切换
      versionEditType: 'new', // 保存类型
      currentVersion: {}, // 当前编辑的的补丁包
      fileToken: {
        token: '', // 七牛上传凭证
        expires: '', // 上传凭证过期时间
        up_host: '', // 上传地址
      }, // 获取上传凭证（七牛）数据
      qiniuResponse: {}, // 七牛文件上传凭证
      deleteVisiable: false, // 删除确认框
      conditionOptions: ['ios>=9', 'ios>=10', 'ios>=11'], // 灰度条件可选项
      mode: 'time', // 模式
      dragPackage: {}, // 当前拖拽的包
      deleteFunc: () => {}, // 确认框确认时需要执行的操作
    };
  }
  componentDidMount() {
    this.searchPageList('packageListInfo', 1); // 获取应用的package列表第一页数据
    this.searchPageList('versionListInfo', 1); // 获取应用的补丁列表第一页数据
  }
  componentDidUpdate() {
    $('.versionWrap').css({ width: '580px', top: '50px' });
  }
  searchPageList(type, currentPage) { // 获取应用的package或补丁列表
    const self = this;
    const params = {
      app_key: this.props.match.params.key,
      page: currentPage,
    };
    self.props.dispatch(actions.check({ url: type === 'packageListInfo' ? 'package/list' : 'version/list', dataName: type === 'packageListInfo' ? 'searchPackageList' : 'searchVersionList', params, callback(res) {
      if (self.patch) { // 组件销毁时不进行数据更新操作
        if (res && res.errno === 0) {
          self.setState(preState => ({
            [type]: {
              currentPage: res.data.currentPage,
              numsPerPage: res.data.numsPerPage,
              count: res.data.count,
              data: currentPage === 1 ? (res.data.data || []) : [...preState[type].data, ...(res.data.data || [])],
              totalPages: res.data.totalPages,
            },
          }));
        } else {
          message.error(res ? res.errmsg : '接口异常，请稍后重试！');
        }
      }
    } }));
  }
  handlePackage(item, e) {
    this.setState(() => ({ currentPackage: item }));
    if (e.key === 'edit') {
      this.props.form.setFieldsValue({ package_name: item.name });
      this.openPackageDialog('edit');
    } else {
      this.deleteFunc = () => {
        const self = this;
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'package/del', tip: '删除', params: { key: this.state.currentPackage.key }, callback(res) {
          self.setState(() => ({ deleteVisiable: false }));
          if (res && res.errno === 0) {
            self.searchPageList('packageListInfo', 1);
          }
        } }));
      };
      this.setState(() => ({ deleteVisiable: true, deleteText: '此操作将永久删除该文件, 是否继续？' }));
    }
  }
  handleVersion(item, e) {
    this.setState(() => ({ currentVersion: item }));
    if (e.key === 'edit') {
      this.props.form.setFieldsValue({
        version_name: item.name,
        release_type: item.release_type,
        gray_type: item.gray_type || 1,
        gray_percent: item.gray_percent * 10 || 20,
        gray_count: item.gray_count || 100,
        condition: item.condition ? JSON.parse(item.condition) : [],
        is_mandatory: item.is_mandatory === 1,
        is_silent: item.is_silent === 1,
        isReleaseNow: false,
        release_time: moment(item.release_time),
        description: item.description,
        meta_info: item.meta_info,
      });
      this.openVersionDialog('edit');
    } else {
      this.deleteFunc = () => {
        const self = this;
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'version/del', tip: '删除', params: { key: this.state.currentVersion.key }, callback(res) {
          self.setState(() => ({ deleteVisiable: false }));
          if (res && res.errno === 0) {
            self.searchPageList('versionListInfo', 1);
          }
        } }));
      };
      this.setState(() => ({ deleteVisiable: true, deleteText: '此操作将永久删除该文件, 是否继续？' }));
    }
  }
  deleteConfirm() {
    this.deleteFunc();
    this.setState(() => ({ deleteVisiable: false }));
  }
  deleteCancel() {
    this.setState(() => ({ deleteVisiable: false }));
  }
  deletePackageVersion(item, element) { // 删除package中的补丁
    this.deleteFunc = () => {
      const self = this;
      const params = {
        package_key: item.key,
        version_key: element.key,
      };
      self.props.dispatch(actions.saveNewOrSaveChange({ url: 'package/cancel_version', tip: '删除', params, callback(res) {
        if (res && res.errno === 0) {
          self.setState(() => ({ dragPackage: {} }));
          self.searchPageList('packageListInfo', 1);
        }
      } }));
    };
    this.setState(() => ({ deleteVisiable: true, deleteText: '此操作将永久删除该文件, 是否继续？' }));
  }
  openPackageDialog(type) {
    this.getFileToken();
    if (type === 'new') this.props.form.resetFields(); // 新增重置表单
    this.setState(() => ({ packageVisiable: true, packageEditType: type, qiniuResponse: {} }));
  }
  openVersionDialog(type) {
    this.getFileToken();
    if (type === 'new') this.props.form.resetFields(); // 新增重置表单
    this.setState(() => ({ versionVisiable: true, versionEditType: type, qiniuResponse: {} }));
  }
  packageAddOrEdit() {
    const self = this;
    const isNew = self.state.packageEditType === 'new';
    self.props.form.validateFields((errors, values) => { // eslint-disable-line
      if (isNew && !self.state.qiniuResponse.hash) {
        message.error('请先上传文件！');
        return false;
      }
      if (!errors) {
        const params = {
          name: values.package_name,
          file_name: self.state.qiniuResponse.name,
          hash: self.state.qiniuResponse.hash,
          app_key: self.props.appInfo.key,
        };
        if (!isNew) params.package_key = self.state.currentPackage.key;
        const url = isNew ? 'package/create' : 'package/update';
        const tip = `${isNew ? '创建' : '更新'}package`;
        self.props.dispatch(actions.saveNewOrSaveChange({ url, tip, params, callback(res) {
          if (res && res.errno === 0 && self.patch) {
            self.setState(() => ({ packageVisiable: false }));
            self.searchPageList('packageListInfo', 1);
          }
        } }));
      }
    });
  }
  versionAddOrEdit() {
    const self = this;
    const isNew = self.state.versionEditType === 'new';
    self.props.form.validateFields((errors, values) => { // eslint-disable-line
      if (isNew && !self.state.qiniuResponse.hash) {
        message.error('请先上传文件！');
        return false;
      }
      if (!errors) {
        const params = {
          name: values.version_name,
          file_name: self.state.qiniuResponse.name,
          hash: self.state.qiniuResponse.hash,
          app_key: self.props.appInfo.key,
          release_type: values.release_type,
          gray_type: values.gray_type,
          gray_percent: values.gray_percent / 10,
          gray_count: values.gray_count,
          condition: JSON.stringify(values.condition),
          is_mandatory: values.is_mandatory === false ? 0 : 1,
          is_silent: values.is_silent === false ? 0 : 1,
          release_time: values.isReleaseNow ? '' : values.release_time.format('YYYY-MM-DD HH:mm:ss'),
          description: values.description,
          meta_info: values.meta_info,
          package_key: '',
        };
        if (!isNew) {
          params.version_key = self.state.currentVersion.key;
          params.release_time = moment(values.release_time).isAfter(moment().format('YYYY-MM-DD HH:mm:ss')) ? moment(values.release_time).format('YYYY-MM-DD HH:mm:ss') : '';
        }
        const url = isNew ? 'version/create' : 'version/update';
        const tip = `${isNew ? '创建' : '更新'}补丁包`;
        self.props.dispatch(actions.saveNewOrSaveChange({ url, tip, params, callback(res) {
          if (res && res.errno === 0 && self.patch) {
            self.setState(() => ({ versionVisiable: false }));
            self.searchPageList('versionListInfo', 1);
          }
        } }));
      }
    });
  }
  handleCancel(type) {
    this.setState(() => ({ [`${type}Visiable`]: false }));
  }
  getFileToken() { // 获取七牛文件上传凭证
    const self = this;
    const nowTime = new Date().getTime() / 1000; // 当前时间戳(只到分钟)
    if (!(self.state.fileToken.expires && self.state.fileToken.expires - nowTime >= 600)) {
      self.props.dispatch(actions.check({ url: 'file/token', params: {}, callback(res) {
        if (self.patch) { // 组件销毁时不进行数据更新操作
          if (res && res.errno === 0) {
            self.setState(preState => ({
              fileToken: res.data,
            }));
          } else {
            message.error(res ? res.errmsg : '接口异常，请稍后重试！');
          }
        }
      } }));
    }
  }
  beforePackageUpload(file, fileList) {
    const reg = new RegExp(this.props.appInfo.platform === 1 ? '\.ipa$' : '\.apk$', ''); // eslint-disable-line
    if (!reg.test(file.name)) {
      message.error(`只能上传${this.props.appInfo.platform === 1 ? '.ipa' : '.apk'}文件`);
      return false;
    }
    return true;
  }
  beforeVersionUpload(file, fileList) {
    if (!/\.ppk$/.test(file.name)) {
      message.error('只能上传.ppk文件');
      return false;
    }
    return true;
  }
  updateFileChange(e) {
    this.setState(() => ({ qiniuResponse: e.file.response }));
    return e && e.fileList;
  }
  isMandatoryValidator(rule, value, callback) {
    const { is_silent } = this.props.form.getFieldsValue();
    if (value && is_silent) this.props.form.setFieldsValue({ is_silent: false });
    callback();
  }
  isSilentValidator(rule, value, callback) {
    const { is_mandatory } = this.props.form.getFieldsValue();
    if (value && is_mandatory) this.props.form.setFieldsValue({ is_mandatory: false });
    callback();
  }
  fileDragStart(item, ev) {
    ev.dataTransfer.setData('dragVersion', window.JSON.stringify(item));
  }
  fileDragEnter(item, ev) {
    const element = this.state.packageListInfo.data.find(ele => ele.key === item.key);
    // console.log('element==', element, !!(!element.version || !element.version.length));
    if (!element.version || !element.version.length) {
      this.setState(() => ({ dragPackage: item }));
    }
  }
  fileDragOver(item, ev) {
    ev.preventDefault();
  }
  fileDrop(item, ev) {
    const dragVersion = window.JSON.parse(ev.dataTransfer.getData('dragVersion'));
    const { dragPackage } = this.state;
    if (item.key === dragPackage.key) {
      const self = this;
      const params = {
        package_key: item.key,
        version_key: dragVersion.key,
      };
      self.props.dispatch(actions.saveNewOrSaveChange({ url: 'package/add_version', tip: '添加', params, callback(res) {
        if (res && res.errno === 0) {
          self.setState(() => ({ dragPackage: {} }));
          self.searchPageList('packageListInfo', 1);
        }
      } }));
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const packageItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const versionItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const fieldsValue = this.props.form.getFieldsValue();
    return (
      <div className="patch" class={ appStyle.patch } ref={(patch) => { this.patch = patch; }}>
{/*         package列表 */}
        <div className="grid-package">
          <div className="package">
            <p className="package-title">package</p>
            <Button icon="plus" size="small" onClick={this.openPackageDialog.bind(this, 'new')}></Button>
          </div>
          <div className="package-list">
            { !this.state.packageListInfo.data.length && <div className="empty">
              <img className="empty-img" src={require('../assets/img/empty.png')} alt="empty" />
              <p className="empty-text">点击右上角"+"按钮创建package</p>
            </div> }
            { this.state.packageListInfo.data.map(item => <div className="package-item" key={item.key}>
              <div className="package-item-top">
                <div className="item-top-row">
                  <p>{ item.name }</p>
                  <Dropdown overlay={<Menu onClick={this.handlePackage.bind(this, item)}>
                        <Menu.Item key="edit">
                          <span>编辑</span>
                        </Menu.Item>
                        <Menu.Item key="delete">
                          <span>删除</span>
                        </Menu.Item>
                      </Menu>}>
                    <Icon type="down" />
                  </Dropdown>
                </div>
                <div className="item-top-row">
                  <p className="app-version">{ item.app_version }</p>
                  <p className="app-version">{ funs.formalTime(item.created_at) }</p>
                </div>
              </div>
              <div className="drag-area-package" onDragEnter={ this.fileDragEnter.bind(this, item) } onDragOver={ this.fileDragOver.bind(this, item) } onDrop={ this.fileDrop.bind(this, item) }>
                { (item.version || []).map(element => <div className="drag-item" key={element.key}>
                  <div className="item-row">
                    <p>{ element.name }</p>
                    <Button className="delete-btn" icon="delete" size="small" title="删除" onClick={ this.deletePackageVersion.bind(this, item, element) }></Button>
                  </div>
                  <div className="item-row">
                    <p>发布时间：</p>
                    <p>{ funs.formalTime(element.release_time) }</p>
                  </div>
                  { element.release_type === 1 && <Tag color="#e4e8f1">开发预览</Tag> }
                  { element.release_type === 2 && <Tag color="#e4e8f1">全量下发</Tag> }
                  { element.release_type === 3 && <Tag color="#e4e8f1">灰度发布</Tag> }
                  { element.release_type === 4 && <Tag color="#e4e8f1">条件下发</Tag> }
                  { element.is_mandatory === 1 && <Tag color="#e4e8f1">强制更新</Tag> }
                  { element.is_silent === 1 && <Tag color="#e4e8f1">静默更新</Tag> }
                </div>) }
              </div>
            </div>)}
{/*             加载更多 */}
            { this.state.packageListInfo.count > this.state.packageListInfo.data.length && <div className="loadmore-btn-box">
              <Button loading={ this.props.searchPackageListIsLoading } onClick={ this.searchPageList.bind(this, 'packageListInfo', this.state.packageListInfo.currentPage + 1) }>加载更多</Button>
            </div> }
          </div>
        </div>
{/*         补丁包列表 */}
        <div className="grid-version">
          <div className="version">
            <p className="version-title">补丁包</p>
            <Button icon="plus" size="small" onClick={this.openVersionDialog.bind(this, 'new')}></Button>
          </div>
          <div className="version-list">
            { !this.state.versionListInfo.data.length && <div className="empty">
              <img className="empty-img" src={require('../assets/img/empty.png')} alt="empty" />
              <p className="empty-text">点击右上角"+"按钮创建补丁</p>
            </div> }
            <div className="drag-area-version">
              { this.state.versionListInfo.data.map(item => <div className="drag-item" key={item.key} draggable onDragStart={ this.fileDragStart.bind(this, item) }>
                <div className="item-row item-row-border">
                  <p>{ item.name }</p>
                  <Dropdown overlay={<Menu onClick={this.handleVersion.bind(this, item)}>
                        <Menu.Item key="edit">
                          <span>编辑</span>
                        </Menu.Item>
                        <Menu.Item key="delete">
                          <span>删除</span>
                        </Menu.Item>
                      </Menu>}>
                    <Icon type="down" />
                  </Dropdown>
                </div>
                <div className="item-row">
                  <p>创建时间：{ funs.formalDate(item.created_at) }</p>
                  <p>发布时间：{ funs.formalTime(item.release_time) }</p>
                </div>
                { item.release_type === 1 && <Tag color="#e4e8f1">开发预览</Tag> }
                { item.release_type === 2 && <Tag color="#e4e8f1">全量下发</Tag> }
                { item.release_type === 3 && <Tag color="#e4e8f1">灰度发布</Tag> }
                { item.release_type === 4 && <Tag color="#e4e8f1">条件下发</Tag> }
                { item.is_mandatory === 1 && <Tag color="#e4e8f1">强制更新</Tag> }
                { item.is_silent === 1 && <Tag color="#e4e8f1">静默更新</Tag> }
              </div>) }
            </div>
{/*             加载更多 */}
            { this.state.versionListInfo.count > this.state.versionListInfo.data.length && <div className="loadmore-btn-box">
              <Button loading={ this.props.searchVersionListIsLoading } onClick={ this.searchPageList.bind(this, 'versionListInfo', this.state.versionListInfo.currentPage + 1) }>加载更多</Button>
            </div> }
          </div>
        </div>
{/*         创建/编辑package */}
        <Modal
          title={`${this.state.packageEditType === 'new' ? '创建' : '编辑'}App`}
          visible={this.state.packageVisiable}
          onOk={this.packageAddOrEdit.bind(this)}
          onCancel={this.handleCancel.bind(this, 'package')}>
          <Form className="login-form">
            <FormItem {...packageItemLayout} label="package名称">
              { getFieldDecorator('package_name', { rules: [{ required: false, message: '请输入package名称' }] })(<Input placeholder="请输入package名称" />) }
            </FormItem>
            <FormItem {...packageItemLayout} label="安装包">
              <div className="dropbox">
                { getFieldDecorator('package_dragger', { valuePropName: 'fileList', getValueFromEvent: this.updateFileChange.bind(this) })(
                  <Upload.Dragger
                    name="file"
                    accept={this.props.appInfo.platform === 1 ? '.ipa' : '.apk'}
                    action={this.state.fileToken.up_host}
                    beforeUpload={ this.beforePackageUpload.bind(this)}
                    data={{ token: this.state.fileToken.token }}>
                    <p className="ant-upload-drag-icon" style={{ marginBottom: '8px' }}>
                      <Icon type="cloud-upload" style={{ color: '#97a8be', fontSize: '60px' }}/>
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '14px' }}>将文件拖到此处，或<em style={{ color: '#20a0ff' }}>点击上传</em></p>
                    <p className="ant-upload-hint" style={{ fontSize: '12px' }}>只能上传 {this.props.appInfo.platform === 1 ? 'ipa' : 'apk'} 文件</p>
                  </Upload.Dragger>) }
              </div>
            </FormItem>
          </Form>
        </Modal>
{/*         创建/编辑补丁 */}
        <Modal
          className="versionWrap"
          title={`${this.state.versionEditType === 'new' ? '创建' : '编辑'}补丁`}
          visible={this.state.versionVisiable}
          onOk={this.versionAddOrEdit.bind(this)}
          onCancel={this.handleCancel.bind(this, 'version')}>
          <Form className="login-form">
            <FormItem {...versionItemLayout} label="补丁名称">
              { getFieldDecorator('version_name', { rules: [{ required: true, message: '请输入补丁名称' }] })(<Input placeholder="请输入补丁名称" />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="安装包">
              <div className="dropbox">
                { getFieldDecorator('version_dragger', { valuePropName: 'fileList', getValueFromEvent: this.updateFileChange.bind(this) })(
                  <Upload.Dragger
                    name="file"
                    accept=".ppk"
                    action={this.state.fileToken.up_host}
                    beforeUpload={ this.beforeVersionUpload.bind(this)}
                    data={{ token: this.state.fileToken.token }}>
                    <p className="ant-upload-drag-icon" style={{ marginBottom: '8px' }}>
                      <Icon type="cloud-upload" style={{ color: '#97a8be', fontSize: '60px' }}/>
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '14px' }}>将文件拖到此处，或<em style={{ color: '#20a0ff' }}>点击上传</em></p>
                    <p className="ant-upload-hint" style={{ fontSize: '12px' }}>只能上传 ppk 文件</p>
                  </Upload.Dragger>) }
              </div>
            </FormItem>
            <FormItem {...versionItemLayout} label="发布类型">
              { getFieldDecorator('release_type', { initialValue: 2 })(
                <RadioGroup>
                  <Radio value={1}>开发预览</Radio>
                  <Radio value={2}>全量下发</Radio>
                  <Radio value={3}>灰度发布</Radio>
                  <Radio value={4}>条件下发</Radio>
                </RadioGroup>) }
            </FormItem>
            <FormItem {...versionItemLayout} label="发布类型" className={ fieldsValue.release_type === 3 ? '' : 'hide' }>
              { getFieldDecorator('gray_type', { initialValue: 1 })(
                <RadioGroup>
                  <Radio value={1}>百分比</Radio>
                  <Radio value={2}>设备数量</Radio>
                </RadioGroup>) }
            </FormItem>
            <FormItem {...versionItemLayout} label="灰度百分比" className={ (fieldsValue.release_type === 3 && (fieldsValue.gray_type === 1 || !fieldsValue.gray_type)) ? '' : 'hide' }>
              { getFieldDecorator('gray_percent', { initialValue: 20 })(
                <Slider dots step={10} />) }
            </FormItem>
            <FormItem {...packageItemLayout} label="灰度设备数量" className={ (fieldsValue.release_type === 3 && fieldsValue.gray_type === 2) ? '' : 'hide' }>
              { getFieldDecorator('gray_count', { initialValue: 100 })(
                <InputNumber min={1} max={100} />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="下发条件" className={ fieldsValue.release_type === 4 ? '' : 'hide' }>
              { getFieldDecorator('condition', {})(
                <Select mode="tags" placeholder="请选择或输入下发条件">
                  { this.state.conditionOptions.map((item, index) => <Option value={item} key={index}>{item}</Option>) }
                </Select>) }
            </FormItem>
            <FormItem {...versionItemLayout} label="强制更新">
              { getFieldDecorator('is_mandatory', { valuePropName: 'checked', rules: [{ validator: this.isMandatoryValidator.bind(this) }] })(<Switch />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="静默更新">
              { getFieldDecorator('is_silent', { valuePropName: 'checked', rules: [{ validator: this.isSilentValidator.bind(this) }] })(<Switch />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="立即发布">
              { getFieldDecorator('isReleaseNow', { valuePropName: 'checked', initialValue: true })(<Switch />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="发布时间" className={ !fieldsValue.isReleaseNow ? '' : 'hide' }>
              { getFieldDecorator('release_time', { initialValue: moment(new Date()) })(
                <DatePicker mode={this.state.mode} style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" onPanelChange={(value, mode) => { this.setState(() => ({ mode })); }} />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="更新描述">
              { getFieldDecorator('description', {})(<TextArea placeholder="请输入更新描述" autosize={{ minRows: 2, maxRows: 2 }} />) }
            </FormItem>
            <FormItem {...versionItemLayout} label="扩展字段">
              { getFieldDecorator('meta_info', {})(<TextArea placeholder="格式为json字符串" autosize={{ minRows: 2, maxRows: 2 }} />) }
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="提示"
          visible={this.state.deleteVisiable}
          onOk={this.deleteConfirm.bind(this)}
          onCancel={this.deleteCancel.bind(this)}>
          <p>{ this.state.deleteText }</p>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appInfo: state.appInfo, // app详情
    searchPackageListIsLoading: state.searchPackageListIsLoading, // 获取补丁包列表加载loading
    searchVersionListIsLoading: state.searchVersionListIsLoading, // 获取版本列表加载loading
  };
};

export default connect(mapStateToProps)(Form.create()(Patch));
