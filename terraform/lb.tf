variable "api-listener-certificate-arn" {
  default = "arn:aws:acm:us-east-1:559050235107:certificate/8a9d743c-2ce8-44d0-8807-9764c054071d"
}

resource "aws_security_group" "https-access" {
  description = "rs ${terraform.workspace} http(s) access"
  name = "rs-${terraform.workspace}-https-access"
  ingress {
    from_port = 80
    protocol  = "tcp"
    to_port   = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 443
    protocol  = "tcp"
    to_port   = 443
    cidr_blocks = ["0.0.0.0/0"]
  }
  vpc_id = aws_vpc.vpc.id
  tags = {
    env = "rs-${terraform.workspace}"
  }
}

resource "aws_alb" "api-balancer" {
  name = "rs-${terraform.workspace}-lb"
  internal           = false
  subnets = [aws_subnet.subnet-a.id, aws_subnet.subnet-b.id]
  tags = {
    env = "rs-${terraform.workspace}"
  }
  security_groups = [aws_security_group.default-sg.id, aws_security_group.http-accsess.id]
  depends_on = [aws_internet_gateway.vpc-internet-gateway, aws_internet_gateway_attachment.vpc-internet-gw-attachment]
}

resource "aws_alb_target_group" "api-target-group" {
  vpc_id = aws_vpc.vpc.id
  health_check {
    enabled = true
    protocol = "HTTP"
    path = "/heathcheck"
  }
  name = "rs-${terraform.workspace}-api-targetgroup"
  target_type = "ip"
  protocol = "HTTP"
  port = 3000
  tags = {
    env = "rs-${terraform.workspace}"
  }
}

resource "aws_alb_listener" "api-listener" {
  load_balancer_arn = aws_alb.api-balancer.arn
  certificate_arn = var.api-listener-certificate-arn
  default_action {
    type = "forward"
    target_group_arn = aws_alb_target_group.api-target-group.arn
  }
  port = 443
  protocol = "HTTPS"
  tags = {
    env = "rs-${terraform.workspace}"
  }
}

output "load-balancer-api-target-group" {
  value = aws_alb_target_group.api-target-group.id
}

resource "aws_route53_record" "api-dns-record" {
  zone_id = var.dns-zone-id
  name    = terraform.workspace != "prod" ? "api-${terraform.workspace}.loc8book.ca" : "api.loc8book.ca"
  type    = "A"
  alias {
    evaluate_target_health = false
    name                   = aws_alb.api-balancer.dns_name
    zone_id                = aws_alb.api-balancer.zone_id
  }
}