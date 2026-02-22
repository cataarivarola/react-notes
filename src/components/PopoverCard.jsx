import { cloneElement, useState } from 'react'

/**
 * 可复用的弹层说明卡片：点击 trigger 后出现遮罩 + 居中卡片，点击遮罩或关闭按钮收起。
 *
 * @param {Object} props
 * @param {React.ReactElement} props.trigger - 可点击的触发元素（如 <button className="inline-link-button">词条</button>），会为其注入 onClick 打开弹层
 * @param {string} props.title - 卡片标题（使用 h3）
 * @param {React.ReactNode} props.children - 卡片正文内容
 * @param {string} [props.closeLabel='了解啦'] - 关闭按钮文案
 */
export default function PopoverCard({ trigger, title, children, closeLabel = '了解啦' }) {
  const [open, setOpen] = useState(false)

  const triggerWithClick = cloneElement(trigger, {
    onClick: (e) => {
      trigger.props.onClick?.(e)
      setOpen(true)
    },
  })

  return (
    <>
      {triggerWithClick}
      {open && (
        <div
          className="babel-popover-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="babel-popover"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popover-card-title"
          >
            <h3 id="popover-card-title">{title}</h3>
            {children}
            <button
              type="button"
              className="babel-popover-close"
              onClick={() => setOpen(false)}
            >
              {closeLabel}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
