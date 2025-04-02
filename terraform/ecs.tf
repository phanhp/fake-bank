resource "aws_ecs_cluster" "ecs-cluster" {
  name = "loc8-${terraform.workspace}"
  tags = {
    env = "loc8-${terraform.workspace}"
  }
}

data "aws_iam_policy_document" "instance_assume_role_policy" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs-task-role" {
  name = "loc8-${terraform.workspace}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.instance_assume_role_policy.json
  path = "/"
  inline_policy {
    name = "loc8-${terraform.workspace}-task-role-policy"
    policy = jsonencode({
      Statement = [
        {
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogStreams",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
      ]
    })
  }
  tags = {
    env = "loc8-${terraform.workspace}"
  }
}

data "aws_iam_policy_document" "ecs-task-execution-role-assume" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs-task-execution-role" {
  name = "loc8-${terraform.workspace}-ecs-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs-task-execution-role-assume.json
  path = "/"
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"]
  inline_policy {
    name = "loc8-${terraform.workspace}-task-execution-role-policy"
    policy = jsonencode({
      Statement = [
        {
          Effect: "Allow"
          Action: ["ssm:GetParameters", "ssm:GetParameter"]
          Resource: "arn:aws:ssm:us-east-1:559050235107:parameter/loc8/${terraform.workspace}/*"
        }
      ]
    })
  }
  tags = {
    env = "loc8-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_log_group" "main-log-group" {
  name = "loc8-${terraform.workspace}"
  tags = {
    env = "loc8-${terraform.workspace}"
  }
}
