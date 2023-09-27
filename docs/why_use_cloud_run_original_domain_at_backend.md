# Why use Cloud Run original domain at backend

This is because using a [custom domain](https://cloud.google.com/run/docs/mapping-custom-domains) is slow.

Here is a simple benchmark.

| | Use custom domain | **Not** use custom domain |
|---|---|---|
| Average latency of 10 requests [ms] | 162.8 | 75.4 |

<details>
  <summary>Benchmark script</summary>

  ```rb
  # $ rb -v
  # ruby 3.1.2p20 (2022-04-12 revision 4491bb740a) [arm64-darwin21]

  require 'net/http'
  require 'benchmark'

  USE_CUSTOM_DOMAIN_URL = URI.parse('https://shamo-api.mtak.app/health')
  NOT_USE_CUSTOM_DOMAIN_URL = URI.parse('https://shamo-backend-b342ronmwa-an.a.run.app/health')

  REQUEST_COUNT = 10

  # avoid cold start
  Net::HTTP.get_response(USE_CUSTOM_DOMAIN_URL)

  use_custom_domain_avg_exec_time_ms = Benchmark.realtime {
    REQUEST_COUNT.times { |_| Net::HTTP.get_response(USE_CUSTOM_DOMAIN_URL) }
  } * 1_000 / REQUEST_COUNT

  not_use_custom_domain_avg_exec_time_ms = Benchmark.realtime {
    REQUEST_COUNT.times { |_| Net::HTTP.get_response(NOT_USE_CUSTOM_DOMAIN_URL) }
  } * 1_000 / REQUEST_COUNT

  puts "AVG at 10 reqs | When use custom domain: #{use_custom_domain_avg_exec_time_ms} ms"
  puts "AVG at 10 reqs | When not use custom domain: #{not_use_custom_domain_avg_exec_time_ms} ms"
  ```

</details>

## References

* <https://zenn.dev/catnose99/scraps/ffdd08cebfad12>
