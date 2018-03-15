import React from 'react';
import { connect } from 'react-redux';
import { Button, message, Menu, Dropdown, Icon, Tag } from 'antd';
import appStyle from 'style/Patch.less';

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
      versionListInfo: { // 补丁包列表信息
        currentPage: 0, // 列表页码
        data: [], // 列表数据
        totalPages: 1, // 列表分页数
        numsPerPage: 10, // 每页的条数
        count: 0, // 总条目数
      },
    };
  }
  componentDidMount() {
    this.searchPageList('packageListInfo', 1); // 获取应用的package列表第一页数据
    this.searchPageList('versionListInfo', 1); // 获取应用的补丁列表第一页数据
  }
  searchPageList(type, currentPage) { // 获取应用的package或补丁列表
    // console.log('searchPageList===', type, currentPage);
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
    console.log(item, e);
  }
  handleVersion(item, e) {
    console.log(item, e);
  }
  deletePackageVersion(item, element) { // 删除package中的补丁
    console.log(item, element);
  }
  addPackage() {
    console.log('addPackage');
  }
  addVersion() {
    console.log('addVersion');
  }
  render() {
    return (
      <div className="patch" class={ appStyle.patch } ref={(patch) => { this.patch = patch; }}>
{/*         package列表 */}
        <div className="grid-package">
          <div className="package">
            <p className="package-title">package</p>
            <Button icon="plus" size="small" onClick={this.addPackage.bind(this)}></Button>
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
              <div className="drag-area-package">
                { item.version.map(element => <div className="drag-item" key={element.key}>
                  <div className="item-row">
                    <p>{ element.name }</p>
                    <Button className="delete-btn" icon="delete" size="small" title="删除" onClick={this.deletePackageVersion.bind(this, item, element)}></Button>
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
            <Button icon="plus" size="small" onClick={this.addVersion.bind(this)}></Button>
          </div>
          <div className="version-list">
            { !this.state.versionListInfo.data.length && <div className="empty">
              <img className="empty-img" src={require('../assets/img/empty.png')} alt="empty" />
              <p className="empty-text">点击右上角"+"按钮创建补丁</p>
            </div> }
            <div className="drag-area-version">
              { this.state.versionListInfo.data.map(item => <div className="drag-item" key={item.key} draggable>
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
{/*         <el-dialog :title="addPackageFormTitle" v-model="addPackageFormVisible" size="small" :close-on-click-modal="false" > */}
{/*           <el-form :model="addPackageForm" :rules="packageFormRules" ref="addPackageForm"> */}
{/*             <el-form-item prop="name" label="package名称" :label-width="formLabelWidth"> */}
{/*               <el-input v-model="addPackageForm.name"></el-input> */}
{/*             </el-form-item> */}
{/*             <el-form-item label="安装包" :label-width="formLabelWidth"> */}
{/*               <el-upload */}
{/*                 className="package-upload" */}
{/*                 :action="fileToken.up_host" */}
{/*                 :data="{token: fileToken.token}" */}
{/*                 type="drag" */}
{/*                 :multiple="false" */}
{/*                 :before-upload="handlePackageBeforeUpload" */}
{/*                 :on-remove="handleRemove" */}
{/*                 :on-success="handleSuccess" */}
{/*                 :on-error="handleError" */}
{/*                 :default-file-list="packageFileList" */}
{/*               > */}
{/*                 <i className="el-icon-upload"></i> */}
{/*                 <div className="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div> */}
{/*                 <div v-if="appInfo.platform === 1" className="el-upload__tip" slot="tip">只能上传ipa文件</div> */}
{/*                 <div v-if="appInfo.platform === 2" className="el-upload__tip" slot="tip">只能上传apk文件</div> */}
{/*               </el-upload> */}
{/*             </el-form-item> */}
{/*           </el-form> */}
{/*           <div v-if="isEditPackage === false" slot="footer" className="dialog-footer"> */}
{/*             <Button @click="addPackageFormVisible = false">取 消</Button> */}
{/*             <Button type="primary" @click="createPackage('addPackageForm')" :loading="isLoading">确 定</Button> */}
{/*           </div> */}
{/*           <div v-if="isEditPackage === true" slot="footer" className="dialog-footer"> */}
{/*             <Button @click="addPackageFormVisible = false">取 消</Button> */}
{/*             <Button type="primary" @click="updatePackage('addPackageForm')" :loading="isLoading">编 辑</Button> */}
{/*           </div> */}
{/*         </el-dialog> */}
{/*         创建/编辑补丁 */}
{/*         <el-dialog :title="addVersionFormTitle" v-model="addVersionFormVisible" size="small" :close-on-click-modal="false"> */}
{/*           <el-form :model="addVersionForm" :rules="versionFormrules" ref="addVersionForm"> */}
{/*             <el-form-item prop="name" label="补丁名称" :label-width="formLabelWidth"> */}
{/*               <el-input v-model="addVersionForm.name"></el-input> */}
{/*             </el-form-item> */}
{/*             <el-form-item label="安装包" :label-width="formLabelWidth"> */}
{/*               <el-upload */}
{/*                 className="package-upload" */}
{/*                 :action="fileToken.up_host" */}
{/*                 :data="{token: fileToken.token}" */}
{/*                 type="drag" */}
{/*                 :multiple="false" */}
{/*                 :before-upload="handleVersionBeforeUpload" */}
{/*                 :on-remove="handleRemove" */}
{/*                 :on-success="handleSuccess" */}
{/*                 :on-error="handleError" */}
{/*                 :default-file-list="versionFileList" */}
{/*               > */}
{/*                 <i className="el-icon-upload"></i> */}
{/*                 <div className="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div> */}
{/*                 <div className="el-upload__tip" slot="tip">只能上传ppk文件</div> */}
{/*               </el-upload> */}
{/*             </el-form-item> */}
{/*             <el-form-item prop="releaseType" label="发布类型" :label-width="formLabelWidth"> */}
{/*               <el-radio-group v-model="addVersionForm.releaseType"> */}
{/*                 <el-radio :label="1">开发预览</el-radio> */}
{/*                 <el-radio :label="2">全量下发</el-radio> */}
{/*                 <el-radio :label="3">灰度发布</el-radio> */}
{/*                 <el-radio :label="4">条件下发</el-radio> */}
{/*               </el-radio-group> */}
{/*             </el-form-item> */}
{/*             如果是灰度发布 */}
{/*             <template v-if="addVersionForm.releaseType === 3"> */}
{/*               <el-form-item prop="grayType" label="灰度下发类型" :label-width="formLabelWidth"> */}
{/*                 <el-radio-group v-model="addVersionForm.grayType"> */}
{/*                   <el-radio :label="1">百分比</el-radio> */}
{/*                   <el-radio :label="2">设备数量</el-radio> */}
{/*                 </el-radio-group> */}
{/*               </el-form-item> */}
{/*               <el-form-item v-if="addVersionForm.grayType === 1" prop="grayPercent" label="灰度百分比" :label-width="formLabelWidth"> */}
{/*                 <el-slider v-model="addVersionForm.grayPercent" :min="10" :max="90" :step="10" show-stops show-input></el-slider> */}
{/*               </el-form-item> */}
{/*               <el-form-item v-if="addVersionForm.grayType === 2" prop="grayCount" label="灰度设备数量" :label-width="formLabelWidth"> */}
{/*                 <el-input v-model="addVersionForm.grayCount"></el-input> */}
{/*               </el-form-item> */}
{/*             </template> */}
{/*             如果是灰度发布 */}
{/*             如果是条件下发 */}
{/*             <el-form-item v-if="addVersionForm.releaseType === 4" prop="condition" label="下发条件" :label-width="formLabelWidth"> */}
{/*               <el-select */}
{/*                 className="condition-select" */}
{/*                 v-model="addVersionForm.condition" */}
{/*                 multiple */}
{/*                 filterable */}
{/*                 allow-create */}
{/*                 placeholder="请选择或输入下发条件" */}
{/*                 > */}
{/*                 <el-option */}
{/*                   v-for="item in addVersionForm.conditionOptions" */}
{/*                   :value="item"> */}
{/*                 </el-option> */}
{/*               </el-select> */}
{/*             </el-form-item> */}
{/*             如果是条件下发 */}
{/*             <el-form-item prop="isMandatory" label="强制更新" :label-width="formLabelWidth"> */}
{/*               <el-switch on-text="" off-text="" v-model="addVersionForm.isMandatory" @change="isMandatoryChange"></el-switch> */}
{/*             </el-form-item> */}
{/*             <el-form-item prop="isSilent" label="静默更新" :label-width="formLabelWidth"> */}
{/*               <el-switch on-text="" off-text="" v-model="addVersionForm.isSilent" @change="isSilentChange"></el-switch> */}
{/*             </el-form-item> */}
{/*             <el-form-item v-if="isEditVersion === false" prop="isReleaseNow" label="立即发布" :label-width="formLabelWidth"> */}
{/*               <el-switch on-text="" off-text="" v-model="addVersionForm.isReleaseNow"></el-switch> */}
{/*             </el-form-item> */}
{/*             <el-form-item v-if="addVersionForm.isReleaseNow === false" prop="releaseTime" label="发布时间" :label-width="formLabelWidth"> */}
{/*               <el-date-picker v-model="addVersionForm.releaseTime" :editable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss"></el-date-picker> */}
{/*             </el-form-item> */}
{/*             <el-form-item prop="description" label="更新描述" :label-width="formLabelWidth"> */}
{/*               <el-input type="textarea" v-model="addVersionForm.description"></el-input> */}
{/*             </el-form-item> */}
{/*             <el-form-item prop="metaInfo" label="扩展字段" :label-width="formLabelWidth"> */}
{/*               <el-input type="textarea" v-model="addVersionForm.metaInfo" placeholder="格式为json字符串"></el-input> */}
{/*             </el-form-item> */}
{/*           </el-form> */}
{/*           <div v-if="isEditVersion === false" slot="footer" className="dialog-footer"> */}
{/*             <Button @click="addVersionFormVisible = false">取 消</Button> */}
{/*             <Button type="primary" @click="createVersion('addVersionForm')" :loading="isLoading">确 定</Button> */}
{/*           </div> */}
{/*           <div v-if="isEditVersion === true" slot="footer" className="dialog-footer"> */}
{/*             <Button @click="addVersionFormVisible = false">取 消</Button> */}
{/*             <Button type="primary" @click="updateVersion('addVersionForm')" :loading="isLoading">编 辑</Button> */}
{/*           </div> */}
{/*         </el-dialog> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchPackageListIsLoading: state.searchPackageListIsLoading, // 获取补丁包列表加载loading
    searchVersionListIsLoading: state.searchVersionListIsLoading, // 获取版本列表加载loading
  };
};

export default connect(mapStateToProps)(Patch);
