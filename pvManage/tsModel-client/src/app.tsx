import React from 'react';
import styled from 'styled-components';
import { history } from './router';
import { Router, NavLink, Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import { routes } from 'router/routes';
import _ from 'lodash';
import { renderRoutes } from 'router/renderRoutes';
import { headlistService } from 'src/service/layout';

import 'antd/dist/antd.min.css';
import 'tms-common-role-menu/lib/app.css';
const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

interface IProps {
    theam?: string;
}
interface Istate {
    collapsed: Boolean;
    headlist: any[];
}
export class App extends React.Component<IProps, Istate> {
    state = {
        collapsed: false,
        headlist: [],
    };

    componentDidMount() {
        this.init();
    }
    init = () => {
        // headlistService.getheadlist().then((value) => {
        //     (value.Data).unshift({ Id: '0', Name: '全部' });

        //     // this.setState({
        //     //     headlist: value.Data,
        //     // });
        // });
        this.setState((state, props) => {
            console.log(state);

            this.setState((state, props) => {
                console.log(state);

                state = {
                    ...state, ...{ headlist: ['a'] },
                };
                // state['headlist'] = value.Data;
                return state;
            });
        });
    }
    onCollapse = (collapsed: Boolean) => {
        this.setState({ collapsed });
    }
    extraBreadcrumbItems(): React.ReactNode {
        const breadcrumbNameMap = {
            '/Coursecenter': '设置1-1',
            '/Coursecenter/3': '设置1-3',
        };

        const Home = withRouter((props) => {
            const { location } = props;
            const pathSnippets = location.pathname.split('/').filter((i) => i);

            const extraBreadcrumbItems = pathSnippets.map((_, index) => {
                const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                return (
                    <Breadcrumb.Item key={url}>
                        <Link to={url}>{breadcrumbNameMap[url]}</Link>
                    </Breadcrumb.Item>
                );
            });
            const breadcrumbItems = [
                <Breadcrumb.Item key="home">
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>,
            ].concat(extraBreadcrumbItems);

            return (
                <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            );
        });
        return <Home />;
    }
    curlocation = (curUrl: string): string => {
        let curpathName = _.join(_.compact(_.drop(_.split(curUrl, '/'), 2)), '/');
        return `/${curpathName}`;
    }
    openKeysArray = (curPathActive: string): string[] => {
        let curparentPath = _.compact(_.split(curPathActive, '/'));
        if (curparentPath.length === 0) { return []; }
        let newarray = (_.filter(routes, (v) => v.path === `/${curparentPath[0]}`))[0];
        return [newarray.path];
    }
    render(): any {
        let curUrl = document.location.pathname;
        let curPathName = this.curlocation(curUrl);
        return (
            <Router history={history} >
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsed={this.state.collapsed} onCollapse={this.onCollapse} defaultCollapsed={true}>
                        <div className="logo" />
                        <Menu theme="dark" defaultSelectedKeys={[curPathName]} mode="inline" defaultOpenKeys={this.openKeysArray(curPathName)}>
                            {
                                _.map(routes, (v, k) => {
                                    return (v.routes ?
                                        <SubMenu
                                            key={v.path}
                                            title={
                                                <span>
                                                    <Icon type="user" />
                                                    <NavLink to={v.path}>{v.linkName}</NavLink>
                                                </span>
                                            }
                                        >
                                            {
                                                _.map(v.routes, (s) => {
                                                    return (<Menu.Item key={s.path}> <NavLink to={s.path}>{s.linkName}</NavLink></Menu.Item>);
                                                })
                                            }
                                        </SubMenu> : <Menu.Item key={v.path}> <NavLink to={v.path}> <Icon type="user" />{v.linkName || ''}</NavLink></Menu.Item>);
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }} />
                        <Content style={{ margin: '10px 16px', background: '#fff', padding: '15px 20px' }}>
                            {this.extraBreadcrumbItems()}
                            {renderRoutes(routes, this.props)}
                        </Content>
                        <Footer style={{ textAlign: 'center', fontSize: '12px', lineHeight: '12px' }}>
                            <p>COPYRIGHT © 2017 嘉兴太美医疗科技有限公司 版权所有 浙ICP备13033914号</p>
                            <p>浙公网安备 33049802000047</p>
                        </Footer>
                    </Layout>
                </Layout>

            </Router>
        );
    }
}
