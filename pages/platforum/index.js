import React from 'react'
import Layout from '@/components/layout/layout'
import styles from '../../styles/platforum/platforum-style.module.css'
import SideBarPc from '@/components/layout/side-bar-pc'
import NewsSection from '../../components/platforum/index-page/news-section'
import LostSection from '../../components/platforum/index-page/lost-section'
import ClassSection from '../../components/platforum/index-page/class-section'

export default function Platforum() {
  return (
    <>
      <section className={`d-flex flex-column h-100 ${styles.BgImg}`}>
        <Layout title="貓狗論壇" pageName="pet-insurance">
          <div className="container">
            <div className="row">
              <SideBarPc></SideBarPc>
              {/* section 這裡開始 */}
              <div className="col-xl-9 col-lg-12">
                <NewsSection></NewsSection>
                <LostSection></LostSection>
                <ClassSection></ClassSection>
              </div>
              {/* section 這裡結束 */}
            </div>
          </div>
        </Layout>
      </section>
    </>
  )
}
