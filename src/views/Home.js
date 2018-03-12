import React from 'react';
import appStyle from 'style/Home.less';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        { title: '应用分发', price: '内侧免费', details: '提供移动应用一键分发' },
        { title: '移动统计', price: '内测免费', details: '为您提供实时、免费、专业的移动应用分析' },
        { title: '代码热更新', price: '公测免费', details: '提供基于ReactNative、JSPatch的代码热推送' },
      ],
      service: [
        { icon: 'icon-realtime-protection', message: '7x24提供服务' },
        { icon: 'icon-globe', message: '我们在全球部署了多个节点' },
        { icon: 'icon-sla', message: '99.99％SLA保证' },
        { icon: 'icon-platform', message: '提供全平台支持' },
      ],
    };
  }
  render() {
    return (
      <div className="home" class={ appStyle.home }>
        <p>领先的 BaaS 提供商<br/>为移动开发提供专业的云端支持</p>
        <div className="products">
          <p className="pro_title">我们的服务</p>
          <p className="service_title">超过数十企业、数百应用托管在此,遍布各热门行业</p>
          <ul className="pro_contain">
            { this.state.products.map((item, index) => (
              <li key={index}>
                  <i className="pro_li_img"></i>
                  <div className="pro_li_body">
                    <p className="pro_li_title">{ item.title }</p>
                    <p className="pro_li_details">{ item.details }</p>
                    <p className="pro_li_price">{ item.price }</p>
                  </div>
              </li>
              )) }
          </ul>
        </div>
        <div className="service">
          <p className="pro_title">简单、专业、独立、可靠</p>
          <p className="service_title">超越市面80%的同类产品，超级好用！我真的不骗你！</p>
          <ul className="ser_contain">
            { this.state.service.map((item, index) => (
              <li key={index}>
                <i className={`ser_li_img ${item.icon}`}></i>
                <p className="ser_li_title">{ item.message }</p>
              </li>
              )) }
          </ul>
        </div>
        <div class="cooperate">
          <p class="pro_title">他们都没在用😂</p>
          <div class="coo_body">
            <img src="https://img.cp.rnkit.ttstatic.net/static/img/home_tmdzsypt-792e0d19d5.792e0d1.png" class="coo_pic" />
          </div>
        </div>
      </div>
    );
  }
}
