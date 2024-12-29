
import clsx from 'clsx'

export function Text({ className, ...props }) {
  return (
    <p
      className={clsx(
        'text-sm/6 text-zinc-600 dark:text-zinc-400',
        className
      )}
      {...props}
    />
  )
}
