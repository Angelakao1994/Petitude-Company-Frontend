import React, { useEffect, useState, useRef, useCallback } from 'react'
import styles from '../../styles/platform/platform-style.module.css'
import { BsBookmarkFill, BsChatText } from 'react-icons/bs'
import moment from 'moment-timezone'
import {
  ARTICLE,
  FAVORITE_ADD_POST,
  FAVORITE_CHECK,
  FAVORITE_REMOVE,
} from '@/configs/platform/api-path'

export default function ArticleBlock({ keyword }) {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [favorites, setFavorites] = useState([])
  const observer = useRef()

  const lastArticleElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [hasMore],
  )

  useEffect(() => {
    setPage(1)
    setData([])
    setHasMore(true)
  }, [keyword])

  useEffect(() => {
    if (hasMore) {
      fetch(`${ARTICLE}?keyword=${encodeURIComponent(keyword)}&page=${page}`)
        .then((r) => r.json())
        .then((myData) => {
          if (myData.rows.length === 0) {
            setHasMore(false)
          } else {
            setData((prevData) => {
              const newData = [...prevData, ...myData.rows]
              return [...new Set(newData.map((item) => item.article_id))].map(
                (id) => newData.find((item) => item.article_id === id),
              )
            })
          }
        })
        .catch((error) => console.error('Error loading articles:', error))
    }
  }, [keyword, page, hasMore])

  const checkFavoriteStatus = async (articleId) => {
    try {
      const response = await fetch(`${FAVORITE_CHECK}/${1}/${articleId}`) // 這裡的1替換為當前用戶的id
      const data = await response.json()
      if (response.ok && data.isFavorite) {
        setFavorites((prev) => [...prev, articleId])
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleFavoriteClick = async (e, articleId) => {
    e.preventDefault() // 防止點擊按鈕時導航到文章頁面
    const isFavorite = favorites.includes(articleId)
    const method = isFavorite ? 'DELETE' : 'POST'
    const url = isFavorite
      ? `${FAVORITE_REMOVE}/${1}/${articleId}` // 這裡的1替換為當前用戶的id
      : FAVORITE_ADD_POST
    const body = isFavorite
      ? null
      : JSON.stringify({
          fk_b2c_id: 1, // 替換為當前用戶的id
          fk_article_id: articleId,
        })

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setFavorites((prev) =>
          isFavorite
            ? prev.filter((id) => id !== articleId)
            : [...prev, articleId],
        )
      } else {
        console.error('操作失敗:', data.error)
      }
    } catch (error) {
      console.error('操作失敗:', error)
    }
  }

  useEffect(() => {
    data.forEach((article) => {
      checkFavoriteStatus(article.article_id)
    })
  }, [data])

  return (
    <>
      {data.map((r, index) => {
        const dateFormat = moment(r.article_date).format('YYYY-MM-DD')
        const isFavorite = favorites.includes(r.article_id)
        if (data.length === index + 1) {
          return (
            <a
              ref={lastArticleElementRef}
              key={r.article_id}
              className={`${styles.AReset} ${styles.AllFont}`}
              href={`../../platform/article/${r.article_id}`}
            >
              <div className="m-2 border-bottom">
                <div className="mx-3 d-flex">
                  <p className="me-3 px-1 border border-dark rounded-3">
                    {r.class_name}
                  </p>
                  <p className={`${styles.LightGray}`}>{dateFormat}</p>
                </div>
                <div className="mx-3">
                  <h2 className={`${styles.TitleOverHide} w-100 mb-3`}>
                    {r.article_name}
                  </h2>
                  <p className={`${styles.ContentOverHide} mx-2`}>
                    {r.article_content}
                  </p>
                </div>
                <div className="d-flex mx-5">
                  <p className={`me-5 ${styles.OrangeYellow}`}>
                    <BsChatText className={`mb-1`} />
                    {r.message_count}
                  </p>
                  <button
                    className={` ${styles.LightGray} ${styles.FavHover} ${styles.BtnReset} ${isFavorite ? styles.FavSet : ''} mb-3`}
                    onClick={(e) => handleFavoriteClick(e, r.article_id)}
                  >
                    <BsBookmarkFill className={`mb-1`} />
                    收藏
                  </button>
                </div>
              </div>
            </a>
          )
        } else {
          return (
            <a
              key={r.article_id}
              className={`${styles.AReset} ${styles.AllFont}`}
              href={`../../platform/article/${r.article_id}`}
            >
              <div className="m-2 border-bottom">
                <div className="mx-3 d-flex">
                  <p className="me-3 px-1 border border-dark rounded-3">
                    {r.class_name}
                  </p>
                  <p className={`${styles.LightGray}`}>{dateFormat}</p>
                </div>
                <div className="mx-3">
                  <h2 className={`${styles.TitleOverHide} w-100 mb-3`}>
                    {r.article_name}
                  </h2>
                  <p className={`${styles.ContentOverHide} mx-2`}>
                    {r.article_content}
                  </p>
                </div>
                <div className="d-flex mx-5">
                  <p className={`me-5 ${styles.OrangeYellow}`}>
                    <BsChatText className={`mb-1`} />
                    {r.message_count}
                  </p>
                  <button
                    className={` ${styles.LightGray} ${styles.FavHover} ${styles.BtnReset} ${isFavorite ? styles.FavSet : ''} mb-3`}
                    onClick={(e) => handleFavoriteClick(e, r.article_id)}
                  >
                    <BsBookmarkFill className={`mb-1`} />
                    收藏
                  </button>
                </div>
              </div>
            </a>
          )
        }
      })}
    </>
  )
}
