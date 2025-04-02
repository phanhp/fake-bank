resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "loc8-${terraform.workspace}-vpc"
    env = "loc8-${terraform.workspace}"
  }
}

resource "aws_subnet" "subnet-a" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.0.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "loc8-${terraform.workspace}-subnet-a"
    env = "loc8-${terraform.workspace}"
  }
}

resource "aws_subnet" "subnet-b" {
  vpc_id = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "loc8-${terraform.workspace}-subnet-b"
    env = "loc8-${terraform.workspace}"
  }
}

resource "aws_security_group" "default-sg" {
  description = "loc8 ${terraform.workspace} default security group"
  name = "loc8-${terraform.workspace}-default-group"
  ingress {
    from_port = 0
    protocol  = "tcp"
    to_port   = 65000
    self = true
  }
  egress {
    from_port = 0
    protocol  = "tcp"
    to_port   = 65000
    cidr_blocks = ["0.0.0.0/0"]
  }
  vpc_id = aws_vpc.vpc.id
  tags = {
    env = "loc8-${terraform.workspace}"
  }
}

resource "aws_internet_gateway" "vpc-internet-gateway" {
  tags = {
    env = "loc8-${terraform.workspace}"
  }
}

resource "aws_internet_gateway_attachment" "vpc-internet-gw-attachment" {
  internet_gateway_id = aws_internet_gateway.vpc-internet-gateway.id
  vpc_id              = aws_vpc.vpc.id
}


resource "aws_route_table" "route_table_public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vpc-internet-gateway.id
  }

  tags = {
    Name = "loc8-${terraform.workspace}-route-table-public"
  }
}

resource "aws_route_table_association" "route_table_association_public" {
  subnet_id      = aws_subnet.subnet-a.id
  route_table_id = aws_route_table.route_table_public.id
}

resource "aws_route_table_association" "route_table_association_public_b" {
  subnet_id      = aws_subnet.subnet-b.id
  route_table_id = aws_route_table.route_table_public.id
}

resource "aws_eip" "eip" {
  vpc        = true
  depends_on = [aws_internet_gateway.vpc-internet-gateway]
  tags = {
    Name = "loc8-${terraform.workspace}-eip"
  }
}
