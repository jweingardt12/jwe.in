                <Card.Title 
                  href={`/notes/${article.slug}`}
                  className="text-zinc-800 dark:text-zinc-100 hover:text-sky-500 dark:hover:text-sky-500"
                  onClick={(e) => {
                    window.umami?.track('note_click', {
                      title: article.title,
                      slug: article.slug
                    })
                  }}
                >
                  {article.title}
                </Card.Title> 