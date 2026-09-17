import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Review, Agent } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import { listResource } from "../../lib/api/resource";
import { useEffect } from "react";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";

const STARS = [1, 2, 3, 4, 5];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {STARS.map((n) => (
      <i key={n} className={`icon-star text-sm ${n <= rating ? "text-warning" : "text-gray-300"}`} />
    ))}
  </div>
);

const formatDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "—";

const STAT_CARD =
  "rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white relative overflow-hidden group h-full flex flex-col";

const Reviews = () => {
  const crud = useCrud<Review>("reviews", { pageSize: 10, searchKeys: ["author", "property", "comment"] });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    listResource<Agent>("agents")
      .then(setAgents)
      .catch(() => setAgents([]));
  }, []);

  const stats = useMemo(() => {
    const all = crud.rows.length ? crud.rows : [];
    const total = crud.total;
    const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
    const pending = all.filter((r) => !r.replied).length;
    const fiveStar = all.filter((r) => r.rating === 5).length;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: all.filter((r) => r.rating === star).length,
    }));
    const maxCount = Math.max(1, ...distribution.map((d) => d.count));
    return { total, avg, pending, fiveStar, distribution, maxCount };
  }, [crud.rows, crud.total]);

  const topAgents = useMemo(
    () => [...agents].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [agents],
  );

  const startReply = (review: Review) => {
    setReplyingId(review.id);
    setReplyText("");
    setReplyError(null);
  };

  const submitReply = async (review: Review) => {
    setReplyError(null);
    try {
      await crud.update(review.id, { replied: true, reply: replyText });
      setReplyingId(null);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to save reply");
    }
  };

  return (
    <main>
      <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">Reviews</h1>
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link to={all_routes.dashboard} className="hover:text-primary">
                Dashboard
              </Link>
              <i className="icon-chevron-right text-xs" />
              <span className="text-gray-900 font-medium">Reviews</span>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <div className={`${STAT_CARD} bg-gradient-to-br from-secondary to-secondary/80`}>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10 flex-1">
                <i className="icon-message-square text-4xl! opacity-50 mb-3 block" />
                <p className="text-sm font-medium text-white mb-1">Total Reviews</p>
                <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold leading-none text-white mb-2">
                  {stats.total}
                </h2>
                <p className="text-xs text-white mb-0">All Time</p>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <div className={`${STAT_CARD} bg-gradient-to-br from-warning to-warning/80`}>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10 flex-1">
                <i className="icon-star text-4xl! opacity-50 mb-3 block" />
                <p className="text-sm font-medium text-white mb-1">Average Rating</p>
                <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold leading-none text-white mb-2">
                  {stats.avg.toFixed(1)}
                </h2>
                <p className="text-xs text-white mb-0">Out of 5.0</p>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <div className={`${STAT_CARD} bg-gradient-to-br from-primary to-primary/80`}>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10 flex-1">
                <i className="icon-clock text-4xl! opacity-50 mb-3 block" />
                <p className="text-sm font-medium text-white mb-1">Pending Response</p>
                <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold leading-none text-white mb-2">
                  {stats.pending}
                </h2>
                <p className="text-xs text-white mb-0">Awaiting Reply</p>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <div className={`${STAT_CARD} bg-gradient-to-br from-success to-success/80`}>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10 flex-1">
                <i className="icon-thumbs-up text-4xl! opacity-50 mb-3 block" />
                <p className="text-sm font-medium text-white mb-1">5-Star Reviews</p>
                <h2 className="text-3xl max-lg:text-2xl max-md:text-[22px] font-bold leading-none text-white mb-2">
                  {stats.fiveStar}
                </h2>
                <p className="text-xs text-white mb-0">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 xl:col-span-8">
            {crud.loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            ) : crud.rows.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-16">No reviews found.</p>
            ) : (
              <div className="space-y-4">
                {crud.rows.map((review) => (
                  <div key={review.id} className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap flex-col sm:flex-row">
                      <div className="flex items-start gap-4 flex-1">
                        <ImageWithBasePath
                          src={review.avatar}
                          alt={review.author}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900 mb-0">{review.author}</h3>
                            <Stars rating={review.rating} />
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            For: {review.property || "—"} | {formatDate(review.date)}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">{review.comment}</p>

                          {review.replied && review.reply && (
                            <div className="rounded-lg bg-light p-3 mb-3">
                              <p className="text-xs font-semibold text-gray-900 mb-1">Your reply</p>
                              <p className="text-xs text-gray-600 mb-0">{review.reply}</p>
                            </div>
                          )}

                          {replyingId === review.id ? (
                            <div className="space-y-2">
                              {replyError && <p className="text-xs text-danger mb-0">{replyError}</p>}
                              <textarea
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 focus:ring-0 focus:border-primary"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => submitReply(review)}
                                  className="text-xs font-semibold text-white bg-primary rounded-full px-3 py-1.5 hover:bg-primary-hover transition cursor-pointer"
                                >
                                  Send Reply
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setReplyingId(null)}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button
                                type="button"
                                onClick={() => startReply(review)}
                                className="text-primary hover:underline font-medium cursor-pointer"
                              >
                                {review.replied ? "Edit Reply" : "Reply"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center text-xs font-bold border rounded-lg px-2.5 py-0.5 ${
                          review.replied
                            ? "text-success border-success"
                            : "text-warning border-warning"
                        }`}
                      >
                        {review.replied ? "Replied" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {crud.pageCount > 1 && (
              <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
                <p className="text-sm text-gray-600 mb-0">
                  Page <span className="font-semibold text-gray-900">{crud.page}</span> of{" "}
                  <span className="font-semibold text-gray-900">{crud.pageCount}</span>
                </p>
                <nav className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    disabled={crud.page <= 1}
                    onClick={() => crud.setPage(crud.page - 1)}
                    className="size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light disabled:opacity-40 cursor-pointer"
                  >
                    <i className="icon-chevron-left" />
                  </button>
                  <button
                    type="button"
                    disabled={crud.page >= crud.pageCount}
                    onClick={() => crud.setPage(crud.page + 1)}
                    className="size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light disabled:opacity-40 cursor-pointer"
                  >
                    <i className="icon-chevron-right" />
                  </button>
                </nav>
              </div>
            )}
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6 mb-4 lg:mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {stats.distribution.map(({ star, count }) => (
                  <div key={star}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{star} Star</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          star >= 4 ? "bg-success" : star === 3 ? "bg-warning" : "bg-danger"
                        }`}
                        style={{ width: `${(count / stats.maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Top Rated Agents</h3>
              {topAgents.length === 0 ? (
                <p className="text-sm text-gray-500 mb-0">No agent data available.</p>
              ) : (
                <div className="space-y-3">
                  {topAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 p-3 rounded-lg bg-white border border-border-color"
                    >
                      <div className="flex items-center gap-2">
                        <ImageWithBasePath
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold text-gray-900 truncate mb-0">{agent.name}</p>
                          <div className="flex items-center gap-0.5">
                            <i className="icon-star text-warning text-xs" />
                            <span className="text-xs text-gray-600">{agent.rating.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{agent.deals} deals</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reviews;
