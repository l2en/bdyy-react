import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Select, Modal, Row, Col, Cascader } from 'antd';
import AddSaleOrBuyContract from './AddSaleOrBuyContract';
import styles from './Contract.less';

const { Option } = Select;

@connect(({ contract, loading }) => ({
  contract: contract.saleContract,
  buyContract: contract.buyContract,
  contractloading: loading.effects['contract/queryListSellByClient'],
  buyContractloading: loading.effects['contract/purchaseInfoByProvider'],
  submitloading: loading.effects['contract/createSell'],
  buySubmitloading: loading.effects['contract/createPurchase'],
  selectClient: contract.selectClientSale,
  selectProvider: contract.selectProvider,
  product: contract.product,
  productOption: contract.productOption,
  provider: contract.provider,
}))
@Form.create()
export default class SaleOrBuyContract extends Component {
  state = {
    addSaleDrawerVisible: false, // 销售合同抽屉
    thisProviderFilter: '', // 销售合同当前筛选供应商
    thisProductFilter: [], // 销售合同当前筛选商品
  };

  componentDidMount() {
    const { dispatch, companyId, selectClient, selectProvider, type } = this.props;
    const providerListPayload = {
      companyId,
      pageSize: 0,
      pageNum: 1,
    };

    if (type === 'sale' && selectClient) {
      dispatch({
        type: 'contract/queryListSellByClient',
        payload: {
          clientId: selectClient,
        },
      });
    } else if (type === 'buy' && selectProvider) {
      dispatch({
        type: 'contract/purchaseInfoByProvider',
        payload: {
          providerId: selectProvider,
        },
      });
    }

    dispatch({
      type: 'contract/getProductList',
    });

    dispatch({
      type: 'contract/getProviderList',
      payload: providerListPayload,
    });
  }

  // 新增销售合同
  handleAddSaleDrawer = () => {
    this.setState({
      addSaleDrawerVisible: true,
    });
  };

  // 关闭销售合同抽屉
  handleSaleClose = () => {
    this.setState({
      addSaleDrawerVisible: false,
    });
  };

  // 新增销售合同提交
  handleAddContract = createPayload => {
    const { dispatch, selectClient, selectProvider, type, product } = this.props;
    const productId = product.filter(item => {
      return (
        item.name === createPayload.product[0] &&
        item.type === createPayload.product[1] &&
        item.packagingType === createPayload.product[2]
      );
    })[0].id;

    if (type === 'sale') {
      const payload = Object.assign(
        {},
        { clientId: createPayload.clientId },
        { date: createPayload.date },
        { price: createPayload.price },
        { providerId: createPayload.providerId },
        { productId }
      );
      dispatch({
        type: 'contract/createSell',
        payload,
        callback: () => {
          this.setState({ addSaleDrawerVisible: false });
          dispatch({
            type: 'contract/queryListSellByClient',
            payload: {
              clientId: selectClient,
            },
          });
        },
      });
    } else if (type === 'buy') {
      const payload = Object.assign(
        {},
        { date: createPayload.date },
        { price: createPayload.price },
        { providerId: createPayload.providerId },
        { productId }
      );
      dispatch({
        type: 'contract/createPurchase',
        payload,
        callback: () => {
          this.setState({ addSaleDrawerVisible: false });
          dispatch({
            type: 'contract/purchaseInfoByProvider',
            payload: {
              providerId: selectProvider,
            },
          });
        },
      });
    }
  };

  // 删除销售合同
  handleDeleteContract = record => {
    const { dispatch, selectClient, selectProvider, type } = this.props;

    Modal.confirm({
      title: '删除合同',
      content: `确定删除该合同？`,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        if (type === 'sale') {
          dispatch({
            type: 'contract/deleteSell',
            payload: {
              id: record.id,
            },
            callback: () => {
              dispatch({
                type: 'contract/queryListSellByClient',
                payload: {
                  clientId: selectClient,
                },
              });
            },
          });
        } else if (type === 'buy') {
          dispatch({
            type: 'contract/deletePurchase',
            payload: {
              id: record.id,
            },
            callback: () => {
              dispatch({
                type: 'contract/purchaseInfoByProvider',
                payload: {
                  providerId: selectProvider,
                },
              });
            },
          });
        }
      },
      onCancel() {},
    });
    return false;
  };

  // 选择客户
  handleSelectClient = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'contract/queryListSellByClient',
      payload: {
        clientId: val,
      },
    });
  };

  // 选择供应商
  handleSelectProvider = val => {
    const { dispatch, type, selectClient } = this.props;
    const { thisProductFilter } = this.state;

    if (type === 'buy') {
      dispatch({
        type: 'contract/purchaseInfoByProvider',
        payload: {
          providerId: val,
        },
      });
    }

    if (type === 'sale' && selectClient) {
      dispatch({
        type: 'contract/queryListSellByClient',
        payload: {
          clientId: selectClient,
        },
        providerFilter: val,
        productFilter: thisProductFilter,
      });
      this.setState({ thisProviderFilter: val });
    }
  };

  handleProductChange = val => {
    const { dispatch, type, selectProvider, selectClient } = this.props;
    const { thisProviderFilter } = this.state;

    if (type === 'buy' && selectProvider) {
      dispatch({
        type: 'contract/purchaseInfoByProvider',
        payload: {
          providerId: selectProvider,
        },
        filter: val,
      });
    }
    if (type === 'sale' && selectClient) {
      dispatch({
        type: 'contract/queryListSellByClient',
        payload: {
          clientId: selectClient,
        },
        providerFilter: thisProviderFilter,
        productFilter: val,
      });
      this.setState({ thisProductFilter: val });
    }
  };

  render() {
    const { addSaleDrawerVisible } = this.state;
    const {
      clientData = [],
      contract: contractList,
      buyContract,
      contractloading,
      buyContractloading,
      selectClient,
      selectProvider,
      submitloading,
      buySubmitloading,
      productOption,
      provider,
      type,
    } = this.props;

    const colums1 = [{ title: '时间段', align: 'center', dataIndex: 'activeDate' }];

    if (type === 'sale') {
      colums1.push({ title: '供应商', align: 'center', dataIndex: 'providerName' });
    }

    const colums2 = [
      { title: '商品名称', align: 'center', dataIndex: 'productName' },
      { title: '商品类型', align: 'center', dataIndex: 'productType' },
      { title: '包装方式', align: 'center', dataIndex: 'productPackagingType' },
      { title: '销售价格', align: 'center', dataIndex: 'price' },
      {
        title: '操作',
        align: 'center',
        render: record => (
          <Fragment>
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => this.handleDeleteContract(record)}
            >
              删除
            </span>
          </Fragment>
        ),
      },
    ];

    const saleColumns = colums1.concat(colums2);

    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            {type === 'sale' ? (
              <Col md={7} sm={24}>
                <span>客户：</span>
                <Select
                  placeholder="请选择"
                  style={{ width: '80%' }}
                  value={selectClient || undefined}
                  onSelect={this.handleSelectClient}
                >
                  {clientData.length > 0
                    ? clientData.map(item => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : ''}
                </Select>
              </Col>
            ) : (
              ''
            )}
            {type === 'buy' ? (
              <Col md={8} sm={24}>
                <span>供应商：</span>
                <Select
                  placeholder="请选择"
                  style={{ width: '70%' }}
                  value={selectProvider || undefined}
                  onSelect={val => this.handleSelectProvider(val)}
                >
                  {provider.length > 0
                    ? provider.map(item => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : ''}
                </Select>
              </Col>
            ) : (
              <Col md={8} sm={24}>
                <span>供应商：</span>
                <Select
                  placeholder="供应商"
                  style={{ width: '70%' }}
                  onSelect={val => this.handleSelectProvider(val)}
                  // defaultValue=''
                >
                  <Option key="all" value="">
                    {'全部'}
                  </Option>
                  {provider.length > 0
                    ? provider.map(item => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : ''}
                </Select>
              </Col>
            )}
            <Col md={7} sm={24}>
              <span>商品：</span>
              <Cascader
                options={productOption}
                style={{ width: '80%' }}
                onChange={this.handleProductChange}
                placeholder="商品"
              />
            </Col>
          </Row>
        </div>
        <div className={styles.tableListOperator}>
          <Button
            icon="plus"
            type="primary"
            disabled={type === 'sale' ? !selectClient : !selectProvider}
            onClick={this.handleAddSaleDrawer}
          >
            新建
          </Button>
        </div>
        <Table
          pagination={false}
          loading={type === 'sale' ? contractloading : buyContractloading}
          dataSource={type === 'sale' ? contractList : buyContract}
          columns={saleColumns}
          rowKey={i => i.id}
        />
        <AddSaleOrBuyContract
          addSaleDrawerVisible={addSaleDrawerVisible}
          type={type}
          thisClient={type === 'sale' ? clientData.filter(i => i.id === selectClient)[0] : ''}
          productOption={productOption}
          provider={provider}
          thisProvider={type === 'buy' ? provider.filter(i => i.id === selectProvider)[0] : ''}
          submitloading={type === 'sale' ? submitloading : buySubmitloading}
          onSaleClose={this.handleSaleClose}
          onAddContract={val => this.handleAddContract(val)}
        />
      </div>
    );
  }
}
