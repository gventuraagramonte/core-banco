import { CoralogixTransactionSampler } from '@coralogix/opentelemetry';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';

const exporter = new OTLPTraceExporter();
const sdk = new NodeSDK({
  sampler: new CoralogixTransactionSampler(new AlwaysOnSampler()),
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: exporter,
});

sdk.start();
