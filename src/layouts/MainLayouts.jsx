/*
 *   Copyright (c) 2025 Stefano Marano https://github.com/StefanoMarano80017
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import React, { useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import {
  DesktopOutlined,
  SettingOutlined,
  CarOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Header, Content, Sider } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { key: '/', icon: <SettingOutlined />, label: 'Setup Simulazione' },
    { key: '/monitor', icon: <DesktopOutlined />, label: 'Monitoraggio Live' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white',
            lineHeight: '32px',
          }}
        >
          {collapsed ? 'EV' : 'MATSim EV'}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: token.colorBgContainer }}>
          <h3 style={{ margin: '0 16px' }}>
            Dashboard di Simulazione Veicoli Elettrici
          </h3>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              height: '100%',
            }}
          >
            <Outlet /> {/* Qui verranno renderizzate le pagine */}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
