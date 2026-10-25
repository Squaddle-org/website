# Minimal static site. nginx-unprivileged already runs as non-root on port 8080 by default,
# which is what k8s/deployments/website's hardened Deployment (runAsNonRoot,
# readOnlyRootFilesystem) needs - see k8s_cluster's deployments/website/deployment.yaml for the
# emptyDir mounts (/tmp, /var/cache/nginx) that make the read-only root filesystem work.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/

EXPOSE 8080
